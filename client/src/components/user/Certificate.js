import React, { useState } from "react";
import { jsPDF } from "jspdf";
import certificateBg from "../../Assets/images/certificate-template-2.png";
import greatVibesBase64 from '../../Assets/Fonts/greatVibesBase64';
import signature from "../../Assets/images/signature-3.png";

const Certificate = ({ userName, courseName, quizPassed }) => {


    const generateCertificate = () => {
        const doc = new jsPDF("landscape", "mm", "a4"); // Landscape mode, A4 size

        // Load Background Image
        const img = new Image();
        img.src = certificateBg;
        img.crossOrigin = "anonymous"; // Avoid CORS issues

        img.onload = () => {
            doc.addImage(img, "PNG", 0, 0, 297, 210); // Full page background 

            // Add the custom font to the VFS (Virtual Font Storage)
            doc.addFileToVFS("GreatVibes-Regular.ttf", greatVibesBase64); // Add Base64 encoded font
            doc.addFont("GreatVibes-Regular.ttf", "GreatVibes", "normal"); // Register the font

            // User Name
            doc.setTextColor(0, 102, 204);
            doc.setFont("times", "bold");
            doc.setFontSize(30);
            doc.text(userName, 148, 110, null, null, "center");

            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.text(`for successfully completing the quiz and demonstrating`, 148, 125, null, null, "center");
            doc.text(`proficiency in ${courseName}.`, 148, 133, null, null, "center");

            // Issue Date
            const issueDate = new Date().toLocaleDateString();
            doc.text(`${issueDate}`, 101, 160);

            // Signature Placeholder
            doc.addImage(signature, "PNG", 165, 140, 55, 30);

            // Save PDF
            doc.save(`${userName}_Certificate.pdf`);
        };
    };

    return (
        <div className="certificate-div">
            {quizPassed && (
                <button onClick={generateCertificate} className="attend-quiz-button">
                    DOWNLOAD CERTIFICATE
                </button>
            )}
        </div>
    );
};

export default Certificate;
