{
    const fieldNames = [
        'Name',
        'Address1',
        'Address2',
        'City',
        'Province',
        'PostalCode'
    ];
    const sameAsPurchaserCheckboxElement = document.querySelector('#orderForm--deceasedSameAsPurchaser');
    function updateDeceasedAddressFields() {
        const isChecked = sameAsPurchaserCheckboxElement.checked;
        if (!isChecked) {
            return;
        }
        for (const fieldName of fieldNames) {
            const deceasedField = document.querySelector(`#orderForm--deceased${fieldName}`);
            const purchaserField = document.querySelector(`#orderForm--purchaser${fieldName}`);
            deceasedField.value = purchaserField.value;
        }
    }
    function toggleSameAsPurchaser() {
        const isChecked = sameAsPurchaserCheckboxElement.checked;
        for (const fieldName of fieldNames) {
            const deceasedField = document.querySelector(`#orderForm--deceased${fieldName}`);
            deceasedField.toggleAttribute('disabled', isChecked);
        }
        updateDeceasedAddressFields();
    }
    for (const fieldName of fieldNames) {
        const purchaserFieldElement = document.querySelector(`#orderForm--purchaser${fieldName}`);
        purchaserFieldElement.addEventListener('input', updateDeceasedAddressFields);
    }
    sameAsPurchaserCheckboxElement.addEventListener('change', toggleSameAsPurchaser);
    toggleSameAsPurchaser();
    const contractTypeIdSelectElement = document.querySelector('#orderForm--contractTypeId');
    function updateDeceasedFields() {
        const isPreneed = contractTypeIdSelectElement?.selectedOptions[0].dataset.isPreneed ===
            'true';
        document
            .querySelector('#orderForm--deathDateString')
            ?.toggleAttribute('disabled', isPreneed);
        document
            .querySelector('#orderForm--deathPlace')
            ?.toggleAttribute('disabled', isPreneed);
        document
            .querySelector('#orderForm--funeralDateString')
            ?.toggleAttribute('disabled', isPreneed);
        document
            .querySelector('#orderForm--funeralTimeString')
            ?.toggleAttribute('disabled', isPreneed);
        sameAsPurchaserCheckboxElement.toggleAttribute('disabled', !isPreneed);
        sameAsPurchaserCheckboxElement
            .closest('label')
            ?.toggleAttribute('disabled', !isPreneed);
        if (!isPreneed) {
            sameAsPurchaserCheckboxElement.checked = false;
            toggleSameAsPurchaser();
        }
    }
    contractTypeIdSelectElement?.addEventListener('change', updateDeceasedFields);
    updateDeceasedFields();
    const funeralHomeIdSelectElement = document.querySelector('#orderForm--funeralHomeId');
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
        const hasDisabledFields = selectedOption.value === '-1';
        funeralHomeNameInput.toggleAttribute('disabled', !hasDisabledFields);
        address1Input.toggleAttribute('disabled', !hasDisabledFields);
        address2Input.toggleAttribute('disabled', !hasDisabledFields);
        cityInput.toggleAttribute('disabled', !hasDisabledFields);
        provinceInput.toggleAttribute('disabled', !hasDisabledFields);
        postalCodeInput.toggleAttribute('disabled', !hasDisabledFields);
        phoneNumberInput.toggleAttribute('disabled', !hasDisabledFields);
        funeralHomeNameInput.value = ['', '-1'].includes(selectedOption.value)
            ? ''
            : selectedOption.textContent.trim();
        address1Input.value = selectedOption.dataset.funeralHomeAddress1 ?? '';
        address2Input.value = selectedOption.dataset.funeralHomeAddress2 ?? '';
        cityInput.value = selectedOption.dataset.funeralHomeCity ?? '';
        provinceInput.value = selectedOption.dataset.funeralHomeProvince ?? '';
        postalCodeInput.value = selectedOption.dataset.funeralHomePostalCode ?? '';
        phoneNumberInput.value = selectedOption.dataset.funeralHomePhoneNumber ?? '';
        funeralDirectorNameInput.disabled = selectedOption.value === '';
    }
    funeralHomeIdSelectElement?.addEventListener('change', updateFuneralHomeAddressFields);
    updateFuneralHomeAddressFields();
    const cemeteryIdSelectElement = document.querySelector('#orderForm--cemeteryId');
    const directionOfArrivalSelectElement = document.querySelector('#orderForm--directionOfArrival');
    function updateCemeteryFields() {
        const selectedOption = cemeteryIdSelectElement.selectedOptions[0];
        const cemeteryKey = selectedOption.dataset.cemeteryKey ?? '';
        const burialSiteNamePrefix = document.querySelector('#orderForm--burialSiteNamePrefix');
        burialSiteNamePrefix.textContent = `${cemeteryKey}-`;
        burialSiteNamePrefix
            .closest('.control')
            ?.classList.toggle('is-hidden', cemeteryKey === '');
        const cemeteryId = Number(selectedOption.value);
        const cemetery = exports.cemeteries.find((cemetery) => cemetery.cemeteryId === cemeteryId);
        const directionsOfArrival = cemetery?.directionsOfArrival ?? {};
        const hasDirectionsOfArrival = Object.keys(directionsOfArrival).length > 0;
        directionOfArrivalSelectElement.toggleAttribute('disabled', !hasDirectionsOfArrival);
        if (hasDirectionsOfArrival) {
            directionOfArrivalSelectElement.innerHTML =
                '<option value="">(Select a Direction of Arrival)</option>';
            for (const [key, value] of Object.entries(directionsOfArrival)) {
                const optionElement = document.createElement('option');
                optionElement.value = key;
                optionElement.textContent = `${key} - ${value}`;
                directionOfArrivalSelectElement.append(optionElement);
            }
        }
        else {
            directionOfArrivalSelectElement.innerHTML =
                '<option value="">(No Set Direction of Arrival)</option>';
        }
        directionOfArrivalSelectElement.value = '';
    }
    cemeteryIdSelectElement.addEventListener('change', updateCemeteryFields);
    updateCemeteryFields();
    const orderFormElement = document.querySelector('#form--orderForm');
    let isFormSubmitting = false;
    async function submitOrderForm() {
        if (orderFormElement === null || isFormSubmitting) {
            return;
        }
        isFormSubmitting = true;
        const formData = new FormData(orderFormElement);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        const contractTypeSelect = orderFormElement.querySelector('#orderForm--contractTypeId');
        if (contractTypeSelect !== null) {
            const selectedOption = contractTypeSelect.selectedOptions[0];
            formObject.contractTypeIdText = selectedOption.textContent.trim();
        }
        const funeralHomeSelect = orderFormElement.querySelector('#orderForm--funeralHomeId');
        if (funeralHomeSelect !== null) {
            const selectedOption = funeralHomeSelect.selectedOptions[0];
            formObject.funeralHomeIdText = selectedOption.textContent.trim();
        }
        const cemeterySelect = orderFormElement.querySelector('#orderForm--cemeteryId');
        if (cemeterySelect !== null) {
            const selectedOption = cemeterySelect.selectedOptions[0];
            formObject.cemeteryIdText = selectedOption.textContent.trim();
            formObject.burialSiteNamePrefix = selectedOption.dataset.cemeteryKey ?? '';
        }
        const intermentContainerTypeSelect = orderFormElement.querySelector('#orderForm--intermentContainerTypeId');
        if (intermentContainerTypeSelect !== null) {
            const selectedOption = intermentContainerTypeSelect.selectedOptions[0];
            formObject.intermentContainerTypeIdText =
                selectedOption.textContent.trim();
        }
        const intermentDepthSelect = orderFormElement.querySelector('#orderForm--intermentDepthId');
        if (intermentDepthSelect !== null) {
            const selectedOption = intermentDepthSelect.selectedOptions[0];
            formObject.intermentDepthIdText = selectedOption.textContent.trim();
        }
        const directionOfArrivalSelect = orderFormElement.querySelector('#orderForm--directionOfArrival');
        if (directionOfArrivalSelect !== null) {
            const selectedOption = directionOfArrivalSelect.selectedOptions[0];
            formObject.directionOfArrivalText = selectedOption.textContent.trim();
        }
        const committalTypeSelect = orderFormElement.querySelector('#orderForm--committalTypeId');
        if (committalTypeSelect !== null) {
            const selectedOption = committalTypeSelect.selectedOptions[0];
            formObject.committalTypeIdText = selectedOption.textContent.trim();
        }
        const serviceTypeLabels = orderFormElement.querySelectorAll('label[for^="orderForm--serviceTypeId-"]');
        serviceTypeLabels.forEach((label) => {
            formObject[`serviceTypeIdText-${label.getAttribute('for')?.split('-').pop()}`] = label.textContent.trim();
        });
        try {
            const result = await fetch(orderFormElement.dataset.action ?? '', {
                body: JSON.stringify(formObject),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            isFormSubmitting = false;
            const data = (await result.json());
            if (data.success) {
                orderFormElement.insertAdjacentHTML('beforebegin', `
            <div class="message is-success">
              <p class="message-body">Order form submitted successfully: ${data.orderFormKey}</p>
            </div>
          `);
                orderFormElement.remove();
            }
            else {
                bulmaJS.alert({
                    contextualColorName: 'danger',
                    message: 'Failed to submit order form. Please try again.'
                });
            }
        }
        catch {
            isFormSubmitting = false;
            bulmaJS.alert({
                contextualColorName: 'danger',
                message: 'Error submitting order form. Please try again.'
            });
        }
    }
    orderFormElement?.addEventListener('submit', (event) => {
        event.preventDefault();
        void submitOrderForm();
    });
}
