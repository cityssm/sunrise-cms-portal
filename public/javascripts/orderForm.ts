/* eslint-disable runtime-cleanup/no-unmanaged-event-listeners */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { PortalCemetery } from 'sunrise-cms-shared'

declare const bulmaJS: BulmaJS

declare const exports: {
  cemeteries: PortalCemetery[]
}

{
  /*
   * Purchaser / Deceased Name and Address Fields
   */

  const fieldNames = [
    'Name',
    'Address1',
    'Address2',
    'City',
    'Province',
    'PostalCode'
  ]

  const sameAsPurchaserCheckboxElement = document.querySelector(
    '#orderForm--deceasedSameAsPurchaser'
  ) as HTMLInputElement

  function updateDeceasedAddressFields(): void {
    const isChecked = sameAsPurchaserCheckboxElement.checked

    if (!isChecked) {
      return
    }

    for (const fieldName of fieldNames) {
      const deceasedField = document.querySelector(
        `#orderForm--deceased${fieldName}`
      ) as HTMLInputElement

      const purchaserField = document.querySelector(
        `#orderForm--purchaser${fieldName}`
      ) as HTMLInputElement

      deceasedField.value = purchaserField.value
    }
  }

  function toggleSameAsPurchaser(): void {
    const isChecked = sameAsPurchaserCheckboxElement.checked

    for (const fieldName of fieldNames) {
      const deceasedField = document.querySelector(
        `#orderForm--deceased${fieldName}`
      ) as HTMLInputElement

      deceasedField.toggleAttribute('disabled', isChecked)
    }

    updateDeceasedAddressFields()
  }

  for (const fieldName of fieldNames) {
    const purchaserFieldElement = document.querySelector(
      `#orderForm--purchaser${fieldName}`
    ) as HTMLInputElement

    purchaserFieldElement.addEventListener('input', updateDeceasedAddressFields)
  }

  sameAsPurchaserCheckboxElement.addEventListener(
    'change',
    toggleSameAsPurchaser
  )

  toggleSameAsPurchaser()

  /*
   * Contract Type
   */

  const contractTypeIdSelectElement = document.querySelector<HTMLSelectElement>(
    '#orderForm--contractTypeId'
  )

  function updateDeceasedFields(): void {
    const isPreneed =
      contractTypeIdSelectElement?.selectedOptions[0].dataset.isPreneed ===
      'true'

    document
      .querySelector<HTMLInputElement>('#orderForm--deathDateString')
      ?.toggleAttribute('disabled', isPreneed)

    document
      .querySelector<HTMLInputElement>('#orderForm--deathPlace')
      ?.toggleAttribute('disabled', isPreneed)

    document
      .querySelector<HTMLInputElement>('#orderForm--funeralDateString')
      ?.toggleAttribute('disabled', isPreneed)

    document
      .querySelector<HTMLInputElement>('#orderForm--funeralTimeString')
      ?.toggleAttribute('disabled', isPreneed)

    sameAsPurchaserCheckboxElement.toggleAttribute('disabled', !isPreneed)

    sameAsPurchaserCheckboxElement
      .closest('label')
      ?.toggleAttribute('disabled', !isPreneed)

    // eslint-disable-next-line unicorn/prefer-early-return
    if (!isPreneed) {
      sameAsPurchaserCheckboxElement.checked = false
      toggleSameAsPurchaser()
    }
  }

  contractTypeIdSelectElement?.addEventListener('change', updateDeceasedFields)

  updateDeceasedFields()

  /*
   * Funeral Home Address Fields
   */

  const funeralHomeIdSelectElement = document.querySelector<HTMLSelectElement>(
    '#orderForm--funeralHomeId'
  )

  function updateFuneralHomeAddressFields(): void {
    const selectedOption = funeralHomeIdSelectElement?.selectedOptions[0]

    if (selectedOption === undefined) {
      return
    }

    const funeralHomeNameInput = document.querySelector(
      '#orderForm--funeralHomeName'
    ) as HTMLInputElement

    const address1Input = document.querySelector(
      '#orderForm--funeralHomeAddress1'
    ) as HTMLInputElement

    const address2Input = document.querySelector(
      '#orderForm--funeralHomeAddress2'
    ) as HTMLInputElement

    const cityInput = document.querySelector(
      '#orderForm--funeralHomeCity'
    ) as HTMLInputElement

    const provinceInput = document.querySelector(
      '#orderForm--funeralHomeProvince'
    ) as HTMLInputElement

    const postalCodeInput = document.querySelector(
      '#orderForm--funeralHomePostalCode'
    ) as HTMLInputElement

    const phoneNumberInput = document.querySelector(
      '#orderForm--funeralHomePhoneNumber'
    ) as HTMLInputElement

    const funeralDirectorNameInput = document.querySelector(
      '#orderForm--funeralDirectorName'
    ) as HTMLInputElement

    const hasDisabledFields = selectedOption.value === '-1'

    funeralHomeNameInput.toggleAttribute('disabled', !hasDisabledFields)
    address1Input.toggleAttribute('disabled', !hasDisabledFields)
    address2Input.toggleAttribute('disabled', !hasDisabledFields)
    cityInput.toggleAttribute('disabled', !hasDisabledFields)
    provinceInput.toggleAttribute('disabled', !hasDisabledFields)
    postalCodeInput.toggleAttribute('disabled', !hasDisabledFields)
    phoneNumberInput.toggleAttribute('disabled', !hasDisabledFields)

    funeralHomeNameInput.value = ['', '-1'].includes(selectedOption.value)
      ? ''
      : selectedOption.textContent.trim()
    address1Input.value = selectedOption.dataset.funeralHomeAddress1 ?? ''
    address2Input.value = selectedOption.dataset.funeralHomeAddress2 ?? ''
    cityInput.value = selectedOption.dataset.funeralHomeCity ?? ''
    provinceInput.value = selectedOption.dataset.funeralHomeProvince ?? ''
    postalCodeInput.value = selectedOption.dataset.funeralHomePostalCode ?? ''
    phoneNumberInput.value = selectedOption.dataset.funeralHomePhoneNumber ?? ''

    funeralDirectorNameInput.disabled = selectedOption.value === ''
  }

  funeralHomeIdSelectElement?.addEventListener(
    'change',
    updateFuneralHomeAddressFields
  )

  updateFuneralHomeAddressFields()

  /*
   * Cemetery Fields
   */

  const cemeteryIdSelectElement = document.querySelector(
    '#orderForm--cemeteryId'
  ) as HTMLSelectElement

  const directionOfArrivalSelectElement = document.querySelector(
    '#orderForm--directionOfArrival'
  ) as HTMLSelectElement

  function updateCemeteryFields(): void {
    const selectedOption = cemeteryIdSelectElement.selectedOptions[0]

    const cemeteryKey = selectedOption.dataset.cemeteryKey ?? ''

    const burialSiteNamePrefix = document.querySelector(
      '#orderForm--burialSiteNamePrefix'
    ) as HTMLSpanElement

    burialSiteNamePrefix.textContent = `${cemeteryKey}-`

    burialSiteNamePrefix
      .closest('.control')
      ?.classList.toggle('is-hidden', cemeteryKey === '')

    const cemeteryId = Number(selectedOption.value)

    const cemetery = exports.cemeteries.find(
      (cemetery) => cemetery.cemeteryId === cemeteryId
    )

    const directionsOfArrival = cemetery?.directionsOfArrival ?? {}

    const hasDirectionsOfArrival = Object.keys(directionsOfArrival).length > 0

    directionOfArrivalSelectElement.toggleAttribute(
      'disabled',
      !hasDirectionsOfArrival
    )

    if (hasDirectionsOfArrival) {
      directionOfArrivalSelectElement.innerHTML =
        '<option value="">(Select a Direction of Arrival)</option>'

      for (const [key, value] of Object.entries(directionsOfArrival)) {
        const optionElement = document.createElement('option')
        optionElement.value = key
        optionElement.textContent = `${key} - ${value}`
        directionOfArrivalSelectElement.append(optionElement)
      }
    } else {
      directionOfArrivalSelectElement.innerHTML =
        '<option value="">(No Set Direction of Arrival)</option>'
    }

    directionOfArrivalSelectElement.value = ''
  }

  cemeteryIdSelectElement.addEventListener('change', updateCemeteryFields)

  updateCemeteryFields()

  /*
   * Form Submission
   */

  const orderFormElement =
    document.querySelector<HTMLFormElement>('#form--orderForm')

  let isFormSubmitting = false

  async function submitOrderForm(): Promise<void> {
    if (orderFormElement === null || isFormSubmitting) {
      return
    }

    isFormSubmitting = true

    // Get form data as an object
    const formData = new FormData(orderFormElement)

    const formObject: Record<string, FormDataEntryValue> = {}
    formData.forEach((value, key) => {
      formObject[key] = value
    })

    // Add text for select elements

    const contractTypeSelect =
      orderFormElement.querySelector<HTMLSelectElement>(
        '#orderForm--contractTypeId'
      )

    if (contractTypeSelect !== null) {
      const selectedOption = contractTypeSelect.selectedOptions[0]
      formObject.contractTypeIdText = selectedOption.textContent.trim()
    }

    const funeralHomeSelect = orderFormElement.querySelector<HTMLSelectElement>(
      '#orderForm--funeralHomeId'
    )

    if (funeralHomeSelect !== null) {
      const selectedOption = funeralHomeSelect.selectedOptions[0]
      formObject.funeralHomeIdText = selectedOption.textContent.trim()
    }

    const cemeterySelect = orderFormElement.querySelector<HTMLSelectElement>(
      '#orderForm--cemeteryId'
    )

    if (cemeterySelect !== null) {
      const selectedOption = cemeterySelect.selectedOptions[0]
      formObject.cemeteryIdText = selectedOption.textContent.trim()
      formObject.burialSiteNamePrefix = selectedOption.dataset.cemeteryKey ?? ''
    }

    const intermentContainerTypeSelect =
      orderFormElement.querySelector<HTMLSelectElement>(
        '#orderForm--intermentContainerTypeId'
      )

    if (intermentContainerTypeSelect !== null) {
      const selectedOption = intermentContainerTypeSelect.selectedOptions[0]
      formObject.intermentContainerTypeIdText =
        selectedOption.textContent.trim()
    }

    const intermentDepthSelect =
      orderFormElement.querySelector<HTMLSelectElement>(
        '#orderForm--intermentDepthId'
      )

    if (intermentDepthSelect !== null) {
      const selectedOption = intermentDepthSelect.selectedOptions[0]
      formObject.intermentDepthIdText = selectedOption.textContent.trim()
    }

    const directionOfArrivalSelect =
      orderFormElement.querySelector<HTMLSelectElement>(
        '#orderForm--directionOfArrival'
      )

    if (directionOfArrivalSelect !== null) {
      const selectedOption = directionOfArrivalSelect.selectedOptions[0]
      formObject.directionOfArrivalText = selectedOption.textContent.trim()
    }

    const committalTypeSelect =
      orderFormElement.querySelector<HTMLSelectElement>(
        '#orderForm--committalTypeId'
      )

    if (committalTypeSelect !== null) {
      const selectedOption = committalTypeSelect.selectedOptions[0]
      formObject.committalTypeIdText = selectedOption.textContent.trim()
    }

    /*
     * Add text for service type labels
     */

    const serviceTypeLabels =
      orderFormElement.querySelectorAll<HTMLLabelElement>(
        'label[for^="orderForm--serviceTypeId-"]'
      )

    serviceTypeLabels.forEach((label) => {
      formObject[
        `serviceTypeIdText-${label.getAttribute('for')?.split('-').pop()}`
      ] = label.textContent.trim()
    })

    try {
      const result = await fetch(orderFormElement.dataset.action ?? '', {
        body: JSON.stringify(formObject),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })

      // eslint-disable-next-line require-atomic-updates
      isFormSubmitting = false

      const data = (await result.json()) as {
        orderFormKey: string
        success: boolean
      }

      if (data.success) {
        // eslint-disable-next-line browser-security/no-innerhtml
        orderFormElement.insertAdjacentHTML(
          'beforebegin',
          /* html */ `
            <div class="message is-success">
              <p class="message-body">Order form submitted successfully: ${data.orderFormKey}</p>
            </div>
          `
        )

        orderFormElement.remove()
      } else {
        bulmaJS.alert({
          contextualColorName: 'danger',
          message: 'Failed to submit order form. Please try again.'
        })
      }
    } catch {
      // eslint-disable-next-line require-atomic-updates
      isFormSubmitting = false

      bulmaJS.alert({
        contextualColorName: 'danger',
        message: 'Error submitting order form. Please try again.'
      })
    }
  }

  orderFormElement?.addEventListener('submit', (event) => {
    event.preventDefault()
    void submitOrderForm()
  })
}
