export class Validations {

  public static  isEndDateBiggerThanStartDate(startdate: string, enddate: string): boolean {
    if (!startdate || !enddate) {
      console.error("Both start date and end date must be provided.");
      return false;
    }

    // Convert the start and end dates from string to Date objects
    const startDateObj = new Date(startdate);
    const endDateObj = new Date(enddate);

    // Calculate the difference in days between the two dates
    const diffTime = endDateObj.getTime() - startDateObj.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 1) {
      console.error("End date must be at least 1 day after the start date.");
      return false;
    }

    return true;
  }
}
