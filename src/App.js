import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true })

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [gif, setGif] = useState(false);
  const [time, setTime] = useState({
    from: "",
    to: ""
  });

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTime({
      ...time,
      [name]: value
    })
  }

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFmpeg command
    await ffmpeg.run(
      '-i', 'test.mp4', 
      `${time.to ? '-t' : ''}`, `${time.from && time.to ? parseInt(time.to) - parseInt(time.from) : time.to}`, 
      `${time.from ? '-ss' : ''}`, `${time.from}` , 
      '-f', 'gif', 
      'out.gif'
    );
    
    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');
    
    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}));
    
    setGif(url);
  }
  
  return ready ? (
    <div className="App">
      <div className="grid">
        <div className="container">
          <h3>Video</h3>
          <div className="video">
            { video && 
              <video 
                controls 
                width="100%"
                height="100%"
                src={URL.createObjectURL(video)}
              >
              </video>
            }
          </div>
            <label htmlFor="file-upload" className="upload-btn">
                Upload File
            </label>
            <input id="file-upload" type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
        </div>
        <div className="btn-panel">
          <label htmlFor="from">From (in seconds):</label>
          <input type="text" id="from" name="from" placeholder="e.g. 30.5" value={time.from} onChange={handleInputChange} /><br></br>
          <label htmlFor="to">To (in seconds):</label>
          <input type="text" id="to" name="to" placeholder="e.g. 33" value={time.to} onChange={handleInputChange} />
          <button className="btn" onClick={convertToGif} >Convert</button>
        </div>
        <div className="container">
          <h3>Result</h3>
          <div className="result">
            { gif && 
              <img src={gif} alt="gif" width="100%" height="100%" />
            }
          </div>
        </div>
      </div>
    </div>
  ) :
  (<p>Loading...</p>);
}

export default App; 