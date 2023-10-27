import React, { useState, useRef } from "react";
import { getBotResponse, upsertFile } from "./utils";
import {
  Input,
  Button,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef();
  const authToken = "ee8f36b0-6e1d-4453-8328-236b86f821e2";
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;
    const newMessages = [
      ...messages,
      { text: `User : ${userInput}`, isUser: true },
    ];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);
    const botAnswer = await getBotResponse(userInput, authToken);
    if (botAnswer) {
      setIsLoading(false);
    }
    // Simulate the bot's response (you can replace this with an actual bot logic)
    setTimeout(() => {
      const botResponse = `Bot : ${botAnswer.answer}`; // Replace with actual bot response
      setMessages([...newMessages, { text: botResponse, isUser: false }]);
    }, 1000);
  };

  const handleFileUpload = async (files) => {
    setFileLoading(true);
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      // Now you can use `formData` to upload the files to a server.
      // For example, using the fetch API:
      console.log("Files ready to be uploaded: ");
      const uploadFIle = await upsertFile(formData, authToken);
      if (uploadFIle) {
        console.log("zzz");
        setFileLoading(false);
      }

      if (fileInputRef.current) {
        console.log("resetting");
        fileInputRef.current.value = "";
      }
    } else {
      console.log("No files selected");
      setFileLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    // setSelectedFiles(files);
    handleFileUpload(files);
  };
  return (
    <>
      <Container>
        <Row xs={12} md={12}>
          <Col
            xs={12}
            md={12}
            className="bg-light border"
            style={{ padding: "4px", marginTop: "24px", borderRadius: "10px" }}
          >
            <input
              style={{ display: "none" }}
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            ></input>
            <Button
              //   loading={fileLoading}
              className="flex-none h-10 w-full"
              icon="FeatherFile"
              color="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              {fileLoading ? <Spinner>Uploading ...</Spinner> : "Upload PDF"}
            </Button>
          </Col>
          <Col xs={12} md={12} style={{ padding: "10px" }}>
            <h5> Chat with your document</h5>
          </Col>
          <Col
            xs={12}
            md={12}
            className="bg-light border"
            style={{ borderRadius: "15px" }}
          >
            <div className="chat-window" style={{ minHeight: "70vh" }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={message.isUser ? "user-message" : "bot-message"}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} style={{ padding: "4px" }}>
            <div className="input-box">
              <InputGroup size="lg">
                <Input
                  type="text"
                  placeholder="Type your question ..."
                  value={userInput}
                  onChange={handleUserInput}
                />
                <Button onClick={handleSendMessage} color="primary">
                  {isLoading ? <Spinner> Loading...</Spinner> : " send "}
                </Button>
              </InputGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatApp;
