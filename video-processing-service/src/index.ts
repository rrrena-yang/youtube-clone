import express from "express";
import ffmpeg from "fluent-ffmpeg"; //wrapper around CLI (command line) tool

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    // get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;
    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path")
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") //360p
        .on("end", function() {
            console.log("Processing finished successfully");
            res.status(200).send("Processing finished successfully")
            //this cant be at the end since the function is async
        })
        .on("error", function(err:any) {
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`)
        })
        .save(outputFilePath)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`);
});