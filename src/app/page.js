"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [term, setTerm] = useState("");
  const [json, setJson] = useState(null);
  const [jsonString, setJsonString] = useState("");
  const [formattedOutput, setFormattedOutput] = useState("");

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (term === "") {
        console.log("Please input an API endpoint");
      } else {
        const response = await axios.get(term);
        setJson(response.data);
        setJsonString(JSON.stringify(response.data, null, 2));
        setFormattedOutput("");
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  const handleTextAreaChange = (event) => {
    setJsonString(event.target.value); // Update the string version of the JSON
    setFormattedOutput(""); // Reset the formatted output while typing (until clicked)
  };

  // Function to safely parse JSON from the string
  const parseJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setJson(parsed); // Update the raw JSON object/array
    } catch (error) {
      console.log("Invalid JSON input:", error.message);
      setJson(null); // Set to null if invalid JSON
    }
  };

  // Convert JSON to HTML (recursive function)
  function jsonToHTML(data) {
    let html = "";

    if (Array.isArray(data)) {
      html += "<ul>";
      data.forEach((item) => {
        html += `<li>${jsonToHTML(item)}</li>`; // Recursively parse each item
      });
      html += "</ul>";
    } else if (typeof data === "object" && data !== null) {
      html += "<div>";
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          html += `<div><strong>${key}:</strong> ${jsonToHTML(
            data[key]
          )}</div>`; // Recursively parse each key
        }
      }
      html += "</div>";
    } else if (typeof data === "string") {
      html = `<span>"${data}"</span>`;
    } else if (typeof data === "number") {
      html = `<span>${data}</span>`;
    } else if (typeof data === "boolean") {
      html = `<span>${data}</span>`;
    } else if (data === null) {
      html = "<span>null</span>";
    }

    return html;
  }

  // Convert JSON to Markdown (recursive function)
  function jsonToMarkdown(data) {
    let markdown = "";

    if (Array.isArray(data)) {
      markdown += "\n";
      data.forEach((item) => {
        markdown += `- ${jsonToMarkdown(item)}\n`; // Recursively parse each item and create a list item
      });
    } else if (typeof data === "object" && data !== null) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          markdown += `**${key}:** ${jsonToMarkdown(data[key])}\n`; // Format as key-value pair with bold key
        }
      }
    } else if (typeof data === "string") {
      markdown = `"${data}"`; // For strings, wrap them in quotes
    } else if (typeof data === "number") {
      markdown = `${data}`; // Display numbers as they are
    } else if (typeof data === "boolean") {
      markdown = `${data}`; // Display booleans as they are
    } else if (data === null) {
      markdown = "null"; // Display 'null' for null values
    }

    return markdown;
  }

  // Handle formatting as HTML
  const handleFormatAsHTML = () => {
    if (json) {
      const html = jsonToHTML(json);
      setFormattedOutput(html); // Update the formatted output state
    } else {
      setFormattedOutput("Invalid JSON to format");
    }
  };

  // Handle formatting as Markdown
  const handleFormatAsMarkdown = () => {
    if (json) {
      const markdown = jsonToMarkdown(json);
      setFormattedOutput(markdown); // Update the formatted output state
    } else {
      setFormattedOutput("Invalid JSON to format");
    }
  };

  // Handle parsing of JSON from textarea to raw JSON
  const handleParseJSON = () => {
    parseJSON(jsonString); // Convert the text into raw JSON and store it
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-2">JSON Formatter</h1>
      <div className="container mx-auto flex h-screen align-center pt-10 gap-4">
        <div className="left">
          <textarea
            rows="30"
            cols="70"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jsonString} // Bind to the editable string version
            onChange={handleTextAreaChange} // Update the string version on change
          ></textarea>
        </div>
        <div className="right border w-full p-3 h-screen overflow-scroll  ">
          <form
            className="flex items-center max-w-lg mx-auto mt-4"
            onSubmit={handleSubmit}
          >
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={term}
                onChange={handleTermChange}
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Endpoint"
                required
              />
            </div>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>

          <div className="flex gap-4 justify-center mt-5">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleFormatAsHTML}
            >
              HTML
            </button>
            <button
              className="border focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleFormatAsMarkdown}
            >
              Markdown
            </button>

            <button
              className="border focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              onClick={handleParseJSON}
            >
              Parse JSON
            </button>
          </div>

          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {formattedOutput && formattedOutput.includes("<") ? (
              // If the output contains HTML tags, render it as HTML
              <div dangerouslySetInnerHTML={{ __html: formattedOutput }}></div>
            ) : (
              // Otherwise, treat it as plain text (Markdown)
              <pre>{formattedOutput}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
