function course(event) {
  const courseType = document.getElementById("presentationDropdown").value;
  const fileInput = document.getElementById("formFileLg").files.length;

  let errorMessage = "";

  if (courseType === "Select course type") {
      errorMessage = "Please select a course type.";
  } else if (fileInput === 0) {
      errorMessage = "Please upload a proof file.";
  }

  if (errorMessage) {
      event.preventDefault(); // Prevent the form from submitting
      document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
  }
}