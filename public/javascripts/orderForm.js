"use strict";
{
    const funeralHomeIdSelectElement = document.querySelector('#orderForm--funeralHome');
    function updateFuneralHomeAddressFields() {
        const selectedOption = funeralHomeIdSelectElement?.selectedOptions[0];
        if (selectedOption === undefined) {
            return;
        }
        const funeralHomeNameInput = document.querySelector('#orderForm--funeralHomeName');
        const address1Input = document.querySelector('#orderForm--funeralHomeAddress1');
        const address2Input = document.querySelector('#orderForm--funeralHomeAddress2');
        const cityInput = document.querySelector('#orderForm--funeralHomeCity');
        const provinceInput = document.querySelector('#orderForm--funeralHomeProvince');
        const postalCodeInput = document.querySelector('#orderForm--funeralHomePostalCode');
        const phoneNumberInput = document.querySelector('#orderForm--funeralHomePhoneNumber');
        const funeralDirectorNameInput = document.querySelector('#orderForm--funeralDirectorName');
        if (selectedOption.value === '-1') {
            funeralHomeNameInput.disabled = false;
            address1Input.disabled = false;
            address2Input.disabled = false;
            cityInput.disabled = false;
            provinceInput.disabled = false;
            postalCodeInput.disabled = false;
            phoneNumberInput.disabled = false;
        }
        else {
            funeralHomeNameInput.value = selectedOption.textContent.trim();
            address1Input.value = selectedOption.dataset.funeralHomeAddress1 ?? '';
            address2Input.value = selectedOption.dataset.funeralHomeAddress2 ?? '';
            cityInput.value = selectedOption.dataset.funeralHomeCity ?? '';
            provinceInput.value = selectedOption.dataset.funeralHomeProvince ?? '';
            postalCodeInput.value = selectedOption.dataset.funeralHomePostalCode ?? '';
            phoneNumberInput.value =
                selectedOption.dataset.funeralHomePhoneNumber ?? '';
            funeralHomeNameInput.disabled = true;
            address1Input.disabled = true;
            address2Input.disabled = true;
            cityInput.disabled = true;
            provinceInput.disabled = true;
            postalCodeInput.disabled = true;
            phoneNumberInput.disabled = true;
        }
        funeralDirectorNameInput.disabled = selectedOption.value === '';
    }
    funeralHomeIdSelectElement?.addEventListener('change', updateFuneralHomeAddressFields);
    updateFuneralHomeAddressFields();
}
