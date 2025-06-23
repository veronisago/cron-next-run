import express from 'express';
import bodyParser from 'body-parser';
import { CronExpressionParser } from 'cron-parser';

const app = express();
app.use(bodyParser.json());

app.get('/functions/cronNextRun', (req, res) => {
  res.json({
    name: 'cronNextRun',
    description: 'Get the next run date for a cron expression',
    input: {
      type: 'string',
      description: 'A cron expression (e.g. "0 8 * * MON-FRI")',
      example: '0 8 * * MON-FRI'
    },
    output: {
      type: 'string',
      description: 'Next execution time in ISO format',
      example: '2025-06-25T08:00:00.000Z'
    }
  });
});


app.post('/functions/cronNextRun', (req, res) => {
  const { input } = req.body;

  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'input must be a cron string' });
  }
  try {
    const interval = CronExpressionParser.parse(input);
    const next = interval.next().toISOString();
    return res.json({ output: next });
  } catch (err) {
    return res.status(400).json({ error: 'invalid cron expression' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`cronNextRun function listening on port ${PORT}`);
});
