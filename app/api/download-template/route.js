const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const templateFilePath = path.join(process.cwd(), 'templates.json');
        const fileContent = await fs.readFile(templateFilePath, 'utf8');
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="templates.json"');
        res.send(fileContent);
    } catch (error) {
        res.status(404).json({ error: 'Templates file not found' });
    }
}