import dedent from "dedent";

export function attributeFunction() {
  return dedent`
  /**
   *   1 - Don't change the function name and parameters
   *   3 - Change function content to match with your test
   *   4 - All your code must be inside the function
   */
   function linkFloorToDevice(attributeValue) {
     const match = attributeValue.match(/\d\.\d+$/);
     if(match) {
       const str = match[0];
       return str.replace(/\D/g,'');
     }
   }
    `;
}

export function endpointFunction() {
  return dedent`
  /**
   *   1 - Don't change the function name and parameters
   *   3 - Change function content to match with your test
   *   4 - All your code must be inside the function
   */
   function linkFloorToDevice(attributeValue) {
     return attributeValue;
   }
    `;
}
