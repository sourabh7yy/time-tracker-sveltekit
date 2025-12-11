<script>
  // Import Supabase client and Svelte utilities
  import { supabase } from "$lib/supabaseClient.js";
  import { onMount } from "svelte";
  import '$lib/styles/global.css';

  // Component state variables
  let logs = [];          // Today's time logs
  let tasks = [];         // Tasks worked on today
  let summary = {         // Aggregated statistics
    totalTime: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  };

  let loading = true;     // Loading state
  let error = "";         // Error message

  // Format seconds into HH:MM:SS display
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Load today's summary data and calculate statistics
  async function loadSummary() {
    loading = true;

    // Verify user authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = "Not logged in.";
      loading = false;
      return;
    }

    // Define today's date range for filtering
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's time logs for the user
    const { data: logsData, error: logErr } = await supabase
      .from("time_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("started_at", startOfDay.toISOString())
      .lte("started_at", endOfDay.toISOString())
      .order("started_at", { ascending: false });

    if (logErr) {
      error = logErr.message;
      loading = false;
      return;
    }

    logs = logsData || [];

    // Get unique task IDs from today's logs
    const taskIds = [...new Set(logs.map((l) => l.task_id))];

    // Fetch task details for tasks worked on today
    if (taskIds.length > 0) {
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .in("id", taskIds);

      tasks = tasksData || [];
    }

    // Calculate summary statistics
    summary.totalTime = logs.reduce(
      (sum, log) => sum + (log.duration_sec || 0),
      0
    );

    // Count tasks by status
    summary.completed = tasks.filter((t) => t.status === "completed").length;
    summary.pending = tasks.filter((t) => t.status === "pending").length;
    summary.inProgress = tasks.filter((t) => t.status === "in_progress").length;

    loading = false;
  }

  // Load summary data when component mounts
  onMount(loadSummary);
</script>

<div class="container-wide">
  <h1>📊 Daily Summary</h1>
  
  {#if loading}
    <p>Loading summary...</p>
  {:else if error}
    <p style="color:red">{error}</p>
  {:else}
    <h2>Today's Stats</h2>
    
    <table class="stats-table">
      <tbody>
        <tr>
          <th>Total Time Tracked</th>
          <td>{formatTime(summary.totalTime)}</td>
        </tr>
        <tr>
          <th>Completed Tasks</th>
          <td>{summary.completed}</td>
        </tr>
        <tr>
          <th>Tasks In Progress</th>
          <td>{summary.inProgress}</td>
        </tr>
        <tr>
          <th>Pending Tasks</th>
          <td>{summary.pending}</td>
        </tr>
      </tbody>
    </table>
    
    <hr />
    
    <h2>Tasks Worked on Today</h2>
    
    {#if tasks.length === 0}
      <p>No tasks worked on today.</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {#each tasks as task}
            <tr>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>
                {formatTime(
                  logs
                    .filter((l) => l.task_id === task.id)
                    .reduce((sum, l) => sum + (l.duration_sec || 0), 0)
                )}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>
