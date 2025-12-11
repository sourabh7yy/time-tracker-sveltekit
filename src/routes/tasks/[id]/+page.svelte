<script>
  // Import Supabase client and SvelteKit utilities
  import { supabase } from "$lib/supabaseClient.js";
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import '$lib/styles/global.css';

  // Component state variables
  let task = null;        // Current task data
  let logs = [];          // Time log history
  let activeLog = null;   // Currently running time log
  let loading = true;     // Loading state
  let error = "";         // Error message

  // Timer state
  let elapsed = 0;        // Elapsed seconds for active timer
  let timerInterval = null; // Interval reference for timer updates

  // Extract task ID from URL parameters
  $: id = $page.params.id;

  // Format seconds into HH:MM:SS display
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Load task data and time logs from database
  async function loadData() {
    loading = true;

    // Verify user authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = "Not logged in.";
      loading = false;
      return;
    }

    // Fetch task details, ensuring user owns the task
    let { data: taskData, error: taskErr } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (taskErr) {
      error = taskErr.message;
      loading = false;
      return;
    }

    task = taskData;

    // Fetch time logs for this task
    const { data: logsData } = await supabase
      .from("time_logs")
      .select("*")
      .eq("task_id", id)
      .order("created_at", { ascending: false });

    logs = logsData || [];

    // Find any active (running) timer
    activeLog = logs.find((l) => l.ended_at === null);

    // If timer is active, calculate elapsed time and start UI updates
    if (activeLog) {
      const start = new Date(activeLog.started_at);
      elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
      startTimerLoop();
    }

    loading = false;
  }

  // Start timer UI updates (increment elapsed time every second)
  function startTimerLoop() {
    stopTimerLoop();
    timerInterval = setInterval(() => {
      elapsed += 1;
    }, 1000);
  }

  // Stop timer UI updates
  function stopTimerLoop() {
    if (timerInterval) clearInterval(timerInterval);
  }

  // Start time tracking for this task
  async function startTimer() {
    stopTimerLoop();

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    // End any existing active timers for this user
    await supabase
      .from("time_logs")
      .update({ ended_at: new Date(), duration_sec: 0 })
      .eq("user_id", user.id)
      .is("ended_at", null);

    // Create new time log entry
    const { data, error } = await supabase
      .from("time_logs")
      .insert({
        task_id: id,
        user_id: user.id,
        started_at: new Date(),
        ended_at: null
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    // Initialize timer state and start UI updates
    activeLog = data;
    elapsed = 0;
    startTimerLoop();
    loadData();
  }

  // Stop active time tracking
  async function stopTimer() {
    if (!activeLog) return;

    stopTimerLoop();

    const duration = elapsed;

    // Update time log with end time and duration
    const { error } = await supabase
      .from("time_logs")
      .update({
        ended_at: new Date(),
        duration_sec: duration
      })
      .eq("id", activeLog.id);

    if (error) {
      alert(error.message);
      return;
    }

    // Reset timer state and refresh data
    activeLog = null;
    elapsed = 0;
    loadData();
  }

  // Load data when component mounts
  onMount(loadData);
  // Clean up timer when component is destroyed
  onDestroy(() => stopTimerLoop());
</script>

<div class="container-wide">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color:red">{error}</p>
  {:else}
    <a href="/tasks" class="back-link">⬅ Back to Tasks</a>
    
    <h1>{task.title}</h1>
    <p>{task.description}</p>
    <p>Status: <strong>{task.status}</strong></p>
    
    <hr />
    
    <h2>⏱ Time Tracker</h2>
    
    {#if activeLog}
      <p class="timer-display">Tracking: <strong>{formatTime(elapsed)}</strong></p>
      <button on:click={stopTimer} class="timer-btn stop-timer">Stop Timer</button>
    {:else}
      <button on:click={startTimer} class="timer-btn start-timer">Start Timer</button>
    {/if}
    
    <hr />
    
    <h2>Time Logs</h2>
    
    {#if logs.length === 0}
      <p>No time logs yet.</p>
    {:else}
      <ul>
        {#each logs as log}
          <li class="log-item">
            <strong>{new Date(log.started_at).toLocaleString()}</strong>
            {#if log.ended_at}
              — Ended: {new Date(log.ended_at).toLocaleString()}
              — Duration: {formatTime(log.duration_sec)}
            {:else}
              — (active)
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>
