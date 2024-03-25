import React, {useCallback, useEffect, useState, useRef} from 'react';
import Styles from "./App.module.css";
import Chatgpt from './chatgpt';
import Sheety from './sheety';
import { PickerOverlay } from 'filestack-react';
import { ThreeDots } from 'react-loader-spinner'

const App = () => {

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [ conversation, setConversation ] = useState( [] );
  const [ loading, setLoading ] = useState( false );
  const prevPromptRef = useRef('');
  const [fileLink, setFileLink] = useState('');
  const [start, setStart] = useState(false);
  const [result, setResult] = useState('');

  useEffect( () => {
    const newConversation = [
      {
        'role': 'assistant',
        'content': response,
      },
      {
        'role': 'user',
        'content': prompt,
      }
    ];
 
    // Save past conversations
    setConversation( [ ...conversation, ...newConversation ] );
 
    // Clear form
    setPrompt( '' );
  }, [ response ] );

  const handleStart = () => {
    setStart(true);
  }

  const handleReset = () => {
    setResult('');
    setResponse('');
    setStart(false);
    setFileLink('');
  }

  // const handleMessageChange = (event) => {
  //   setPrompt(event.target.value);
  // }

  const handleSubmit = useCallback( async ( event ) => {
    event.preventDefault();
 
    // Form is empty, do not submit
    // if ( !prompt ) {
    //   alert( 'Please add prompt' );
    //   return;
    // }
 
    // Still loading, do not submit
    if ( loading ) return;
 
    setLoading( true );
 
    try {
      const responseText = await Chatgpt(conversation, prompt, fileLink);
      setResponse(responseText.trim());
      const addRow = await Sheety(responseText, fileLink);
      await console.log(addRow);
      await console.log(JSON.stringify(addRow, undefined, 2));
      await setResult(JSON.stringify(addRow, undefined, 2));
 
    } catch ( error ) {
      console.error( error );
 
    } finally {
      setLoading( false );
      prevPromptRef.current = prompt;
    }
  }, [ loading, prompt, conversation ] );

  return (
    <>
      {!start && (
        <div className={Styles.welcome}>
        <h1 className={Styles.title}>Receipt Uploaduhhh</h1>
        <p className={Styles.button} onClick={handleStart}>START</p>
      </div>
      )}
      {start && (
        <div className={Styles.content}>
          {!fileLink && (
            <PickerOverlay
            apikey={process.env['REACT_APP_FILESTACK_API_KEY']}
            onUploadDone={(res) => {
              console.log(res);
              setFileLink(res.filesUploaded[0].url);
            }}
          />
          )}
          <p className={Styles.filestackResponse}>Uploaded receipt link: <a href={fileLink} className={Styles.receiptLink}>{fileLink}</a></p>
          <form onSubmit={ handleSubmit }>
          {/* <label>
              <textarea
                rows='5'
                cols='50'
                value={ prompt }
                onChange={ handleMessageChange }
              />
            </label> */}
            <button className={Styles.button} type="submit">Submit</button>
          </form>
          {loading && (
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#124559"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          )}
          { response && !loading && (
            <div className={Styles.response}>
              <h2>AI scan result 🤖</h2>
              <p>{ response }</p>
            </div>
          ) }
          { result && !loading && (
            <>
              <div className={Styles.response}>
                <h2>New row added ✅</h2>
                <p>{ result }</p>
              </div>
              <p className={Styles.buttonReset} onClick={handleReset}>Do that again</p>
            </>
          ) }
        </div>
      )}
    </>
  );
}

export default App;
