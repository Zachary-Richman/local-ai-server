import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use('/static/', express.static('static'));
app.engine('html', require('ejs').renderFile);


app.get('/', (req: express.Request, res: express.Response) => {
   res.render('./index.html');
});


// Route that handles streaming cURL response
app.get('/api/stream', async (req: express.Request, res: express.Response) => {
    try {
        // Make the request to the streaming API
        const response = await axios({
            method: 'post',
            url: 'http://localhost:11434/api/generate',
            data: {
                model: 'llama3.1',
                prompt: 'Why is the sky blue?'
            },
            responseType: 'stream' // Receive response as a stream
        });

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Pipe the stream data from the external API to the response
        response.data.on('data', (chunk: any) => {
            res.write(`data: ${chunk}\n\n`); // Send each chunk as a new message
        });

        response.data.on('end', () => {
            res.end(); // End the response when the stream ends
        });
    } catch (error) {
        console.error('Error while streaming data:', error);
        res.status(500).send('Error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
