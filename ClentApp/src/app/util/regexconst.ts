export class Regexconst{
  public static nameRegex: RegExp = /^[A-Z][a-zA-Z0-9]*([ ][A-Z][a-zA-Z0-9]*){0,2}$/;
  public static supNameRegex: RegExp = /^[A-Z][a-zA-Z0-9]*([ ][A-Z&.-][a-zA-Z0-9]*){0,2}$/;
  public static addressRegex: RegExp = /^[A-Z][a-zA-Z0-9]*(?:[ ,\/][a-zA-Z0-9]+)*$/;
  // Phone number pattern: 0XX-XXXXXXX
  public static phoneNumberRegex: RegExp = /^0\d{2}-\d{7}$/;
  public static mobilePhoneNumberRegex: RegExp = /^07\d{1}-\d{7}$/;
  public static emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //123456.55
  public static totalPriceRegex: RegExp = /^\d{1,6}(\.\d{1,2})?$/;
  public static unitPriceRegex: RegExp = /^\d{1,5}(\.\d{1,2})?$/;
  public static qohRegex: RegExp = /^\d{1,4}(\.\d{2})?$/;
  public static qohRMRegex: RegExp = /^\d{1,4}(\.\d{1,2})?$/;
  public static regNumberRegex: RegExp = /^[a-zA-Z0-9]{6,15}$/;
  public static descriptionRegex: RegExp = /^[a-zA-Z0-9\s.,!?()\-]*$/;
  public static amountRegex: RegExp = /^d{1,4}$/;
}
