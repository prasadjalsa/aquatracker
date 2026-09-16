export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AquaTracker</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, sans-serif;
      background: #f0f8ff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      padding: 48px 40px;
      text-align: center;
      max-width: 400px;
    }
    .logo { font-size: 48px; margin-bottom: 12px; }
    h1 { color: #0a2342; margin: 0 0 8px; }
    p  { color: #6b7a8d; margin: 0; }
    .badge {
      display: inline-block;
      margin-top: 24px;
      background: #3ab87a;
      color: #fff;
      border-radius: 20px;
      padding: 6px 18px;
      font-size: 14px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🐠</div>
    <h1>AquaTracker</h1>
    <p>Your aquascape companion is on its way.</p>
    <span class="badge">Worker deployed successfully</span>
  </div>
</body>
</html>`,
      {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
};
