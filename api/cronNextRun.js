import { CronExpressionParser } from 'cron-parser';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      name: 'cronNextRun',
      description: 'Get the next run date(s) for a cron expression with optional timezone and count',
      input: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Cron expression (e.g. "0 8 * * MON-FRI")',
            example: '0 8 * * MON-FRI'
          },
          timezone: {
            type: 'string',
            description: 'Optional IANA timezone (e.g. "Europe/London")',
            example: 'Europe/London'
          },
          count: {
            type: 'number',
            description: 'Number of next run dates to return',
            example: 3
          }
        },
        required: ['expression']
      },
      output: {
        type: 'array',
        description: 'Array of upcoming run dates in ISO format (UTC)',
        example: [
          '2025-06-24T07:00:00.000Z',
          '2025-06-25T07:00:00.000Z',
          '2025-06-26T07:00:00.000Z'
        ]
      }
    });
  }

  if (req.method === 'POST') {
    const { expression, timezone, count = 1 } = req.body.input || {};
    if (typeof expression !== 'string') {
      return res.status(400).json({ error: 'expression must be a cron string' });
    }

    try {
      const options = {};
      if (timezone) options.tz = timezone;
      const interval = CronExpressionParser.parse(expression, options);

      let runs = [];
      if (count > 1) {
        runs = interval.take(count).map(date => date.toISOString());
      } else {
        runs = [interval.next().toISOString()];
      }

      return res.status(200).json({ output: runs });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
