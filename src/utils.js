export const getWebViewContent = (url, paused, muted) => {
    return `
      <html>
        <body style="margin:0;padding:0;overflow:hidden;">
          <video 
            id="video" 
            width="100%" 
            height="100%" 
            ${paused ? 'paused' : 'autoplay'} 
            ${muted ? 'muted' : ''}
            controls
          >
            <source src="${url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </body>
        <script>
          document.getElementById('video').${paused ? 'pause' : 'play'}();
        </script>
      </html>
    `;
  };