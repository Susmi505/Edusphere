// const Certificates = require('../models/certificates'); // Adjust the path if needed
// const mongoose = require('mongoose');

// // Function to generate a certificate
// exports.generateCertificate = async (req, res) => {
//   try {
//     const { userID, courseID } = req.body;

//     // Input validation: Check if userID and courseID are provided
//     if (!userID || !courseID) {
//       return res.status(400).json({ error: 'UserID and CourseID are required' });
//     }
//      if (!mongoose.Types.ObjectId.isValid(userID)) {
//         return res.status(400).json({ error: 'Invalid userID' });
//     }

//     if (!mongoose.Types.ObjectId.isValid(courseID)) {
//         return res.status(400).json({ error: 'Invalid courseID' });
//     }

//     // Create a new certificate document
//     const newCertificate = new Certificates({
//       issueDate: new Date(), // Set the issue date to now
//       userID: userID,
//       courseID: courseID,
//     });

//     // Save the certificate to the database
//     const savedCertificate = await newCertificate.save();

//     // Respond with the saved certificate data
//     res.status(201).json(savedCertificate);
//   } catch (error) {
//     // Handle errors during the certificate generation process
//     console.error('Error generating certificate:', error);
//     res.status(500).json({ error: 'Failed to generate certificate', details: error.message });
//   }
// };

// // Function to get a certificate by ID
// exports.getCertificateById = async (req, res) => {
//     try{
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid certificate ID' });
//         }
//         const certificate = await Certificates.findById(id)
//                                                 .populate('userID', 'name email') 
//                                                 .populate('courseID', 'courseName'); 

//         if(!certificate){
//             return res.status(404).json({error: 'Certificate not found'});
//         }

//         res.status(200).json(certificate);

//     } catch(error){
//         console.error("Error getting certificate", error);
//         res.status(500).json({ error: 'Failed to get certificate', details: error.message });
//     }
// }

// exports.getUserNameById = async (req, res) => {
//   try {
//     // Fetch user data by ID from the database
//     const user = await User.findById(req.params.id);
    
//     // If user not found, return 404
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }
    
//     // Respond with user name
//     res.json({ name: user.name });
// } catch (error) {
//     // In case of server errors, respond with 500
//     res.status(500).json({ message: "Server error", error: error.message });
// }
// };