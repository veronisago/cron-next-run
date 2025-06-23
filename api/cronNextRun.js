import { CronExpressionParser } from 'cron-parser';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
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
  }

  if (req.method === 'POST') {
    const { input } = req.body;
    if (typeof input !== 'string') {
      return res.status(400).json({ error: 'input must be a cron string' });
    }
    try {
      const interval = CronExpressionParser.parse(input);
      const next = interval.next().toISOString();
      return res.json({ output: next });
    } catch {
      return res.status(400).json({ error: 'invalid cron expression' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
