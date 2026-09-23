export const formatDate = (date) => {
    // Check if date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return "Invalid Date";
    }

    // Get the month, day, and year
    const month = parsedDate.toLocaleString("en-US", { month: "short" });
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
};