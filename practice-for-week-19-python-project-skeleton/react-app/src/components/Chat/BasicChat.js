import { useEffect } from "react";

const BasicChat = (url) => {

  useEffect(() => {
    const script = document.createElement('script');
    const customScript = document.createElement('script')

    script.type = "text/javascript"
    script.src = "//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"
    script.async = true;

    customScript.src = "{{ url_for('/scripts/)}}"

    document.body.appendChild(script);

    return()=>{
      document.body.removeChild(script);
    }
  },[url]);

  return (
    <>
      <div className="message-section"></div>
      <div className="input-area">
        <input
          type="text"
          id="user_message"
          placeholder="Type here..."
          autoComplete="off"
        />
        <button type="button" className="button">
          SEND
        </button>
      </div>
    </>
  );
};

export default BasicChat;
