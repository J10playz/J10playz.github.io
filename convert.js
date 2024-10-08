async function convertDocxToPdf() {
    const docxUrl = "https://www.dropbox.com/scl/fi/75ju7g3xe5wi07xuvzsif/H446-03-Project-Basketball-Shootout-Jason-Tuladhar.docx?rlkey=jjlar9j4ci12ecrjaf7k4by7e&st=9y9xbpdc&dl=0"; // Your Dropbox link
    const cloudConvertApiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTlkZDExOTQ2ZWI3NDdkMTJjNThhMTQxY2I4MjNjNGFlMDkxZWMzNGIxZjBlMGQ4NDU3ODRhYzRmNzVjMGU0MGRlMTRiZGE4MjhlNmM2MTUiLCJpYXQiOjE3MjcyODMyNDUuMTk2NzUyLCJuYmYiOjE3MjcyODMyNDUuMTk2NzU0LCJleHAiOjQ4ODI5NTY4NDUuMTgwMTksInN1YiI6IjY5Njk5NTk5Iiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIl19.HebQ-lJP2_dCpmVkcAj1USQJhmIao-N8VXW_KUOzDG6OQ4uDnVUqKy2Ss9haBWeu0QlZPGBgZCw6VMxIA90tFYtw4cP8efKvEJ8cAQLE4LAoJQrasIDZPa-udzHovaYS2iRVYk3YVirtKapFTmkkc8W9xJGsBg0jQco6CogWeN7qUA9cHqEm2MVS7zMqorR8DO1lsSXpNlte51tVpKmTagaNGzFti0JqdBFfKD0FDK_38A3cQ0gdGmc997AVdHtHhnj81b-TbNjXV3BSK95sxS1GONbF__jKumUTNo-ugoW4mxrjgNgmKDZ-CH0d8JQId4anGpLqAHbK_209J_2zT4QMdI7m-p2KHUik8VVmM7gaP-2cFprL3oOXm5z3WbaOSvApcocJVvkj81RpGtegS9YhmTDdgkcWfZv-5kidFRPZMs-SR9Z_KO2wpOa-CUiZpJkrMdd-s6e9iwM4B_RQ84MqrY1haXqPjDBT6xm9qO2CwQ3WyRpMFxRzgBRk_f1Kjhjj84w065rZhZs2O0LnOIMBvfIixEgii4TjRL3C1Jm-PWtTbYn4HaAyzR7t5yM_k3uBjEBoI6H_x49ZyRNLJWF5-5Die9XQrYf1Q9HnC3xAsmqLDczTiH3B7FHb3nB4olOz5Y0UeJ9yO0ge0GDAcxQ8rwavDVsnLaDtjEY7uCE"; // Your API key

    try {
        console.log("Starting the conversion process...");

        // Prepare the conversion request
        const response = await fetch("https://api.cloudconvert.com/v2/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cloudConvertApiKey}`
            },
            body: JSON.stringify({
                tasks: {
                    "import-docx": {
                        "operation": "import/url",
                        "url": docxUrl
                    },
                    "convert-docx-to-pdf": {
                        "operation": "convert",
                        "input": "import-docx",
                        "output_format": "pdf"
                    },
                    "export-pdf": {
                        "operation": "export/url",
                        "input": "convert-docx-to-pdf"
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const conversionJob = await response.json();
        console.log("Conversion job response:", conversionJob);

        // Log all tasks for debugging
        const tasks = conversionJob.data.tasks;
        console.log("All tasks in the job:", tasks);

        // Find the export task
        const exportUrlTask = tasks.find(task => task.name === 'export-pdf');
        console.log("Export task details:", exportUrlTask);

        if (!exportUrlTask || !exportUrlTask.result || !exportUrlTask.result.files) {
            throw new Error("No export URL or files found in the response.");
        }

        const pdfUrl = exportUrlTask.result.files[0].url;
        console.log("PDF URL:", pdfUrl);

        // Show the PDF
        const pdfViewer = document.getElementById("pdf-viewer");
        pdfViewer.innerHTML = `<iframe src="${pdfUrl}" width="100%" height="600px"></iframe>`;

    } catch (error) {
        console.error("An error occurred during the conversion:", error);

        const pdfViewer = document.getElementById("pdf-viewer");
        pdfViewer.innerHTML = `<p>Sorry, there was an error converting your document: ${error.message}</p>`;
    }
}

// Call the function when the page loads
convertDocxToPdf();
