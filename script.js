// Global state
let currentStep = 1
let selectedPlan = null
let paymentMethod = null

const plans = {
  silver: {
    id: "silver",
    name: "Plano Silver",
    price: 20.9,
    description: "Todos os cursos liberados",
    features: ["Qualidade Boa", "Suporte ao aluno", "Carta para Estágio", "Certificado"],
  },
  premium: {
    id: "premium",
    name: "Plano Premium",
    price: 34.9,
    description: "Todos os cursos liberados",
    features: ["Qualidade Fantástica", "Suporte ao aluno", "Com Carta para Estágio", "Com Certificado"],
  },
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializePlanSelection()
  initializePaymentMethods()
  updateStepIndicator()
})

// Plan Selection Functions
function initializePlanSelection() {
  const planCards = document.querySelectorAll(".plan-card")
  const continueBtn = document.getElementById("continue-btn")

  planCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selection from all cards
      planCards.forEach((c) => c.classList.remove("selected"))

      // Add selection to clicked card
      this.classList.add("selected")

      // Store selected plan
      const planId = this.dataset.plan
      selectedPlan = plans[planId]

      // Enable continue button
      continueBtn.disabled = false
    })
  })

  continueBtn.addEventListener("click", () => {
    if (selectedPlan) {
      goToStep(2)
      updatePaymentSummary()
    }
  })
}

// Payment Method Functions
function initializePaymentMethods() {
  const paymentMethods = document.querySelectorAll(".payment-method")

  paymentMethods.forEach((method) => {
    method.addEventListener("click", function () {
      const methodType = this.dataset.method
      paymentMethod = methodType

      if (methodType === "credit-card") {
        goToStep(3)
        updateCreditCardForm()
      } else if (methodType === "pix") {
        goToStep(4)
        updatePixForm()
      }
    })
  })
}

// Navigation Functions
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"))

  // Show target step
  document.getElementById(`step-${step}`).classList.add("active")

  currentStep = step
  updateStepIndicator()
}

function goBack() {
  if (currentStep === 2) {
    goToStep(1)
    selectedPlan = null
    document.getElementById("continue-btn").disabled = true
    document.querySelectorAll(".plan-card").forEach((card) => {
      card.classList.remove("selected")
    })
  } else if (currentStep === 3 || currentStep === 4) {
    goToStep(2)
    paymentMethod = null
  }
}

function updateStepIndicator() {
  document.getElementById("current-step").textContent = currentStep
}

// Update Summary Functions
function updatePaymentSummary() {
  if (!selectedPlan) return

  document.getElementById("summary-plan-name").textContent = selectedPlan.name
  document.getElementById("summary-plan-description").textContent = selectedPlan.description
  document.getElementById("summary-plan-price").textContent =
    `R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}/mês`
}

function updateCreditCardForm() {
  if (!selectedPlan) return

  // Update plan summary in credit card form
  document.getElementById("card-plan-name").textContent = selectedPlan.name
  document.getElementById("card-plan-description").textContent = selectedPlan.description
  document.getElementById("card-plan-annual").textContent =
    `Assinatura anual (12x R$ ${selectedPlan.price.toFixed(2).replace(".", ",")})`
  document.getElementById("monthly-price").textContent = `R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`

  // Generate installment options
  generateInstallmentOptions()
}

function updatePixForm() {
  if (!selectedPlan) return

  const annualPrice = selectedPlan.price * 12

  // Update plan summary in PIX form
  document.getElementById("pix-plan-name").textContent = selectedPlan.name
  document.getElementById("pix-plan-description").textContent = selectedPlan.description
  document.getElementById("pix-plan-annual").textContent =
    `Equivale a 12x R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`
  document.getElementById("pix-annual-price").textContent = `R$ ${annualPrice.toFixed(2).replace(".", ",")}`
}

function generateInstallmentOptions() {
  if (!selectedPlan) return

  const select = document.getElementById("installments")
  const annualValue = selectedPlan.price * 12

  // Clear existing options
  select.innerHTML = '<option value="">Selecione as parcelas</option>'

  // Generate options for 1 to 12 installments
  for (let i = 1; i <= 12; i++) {
    const installmentValue = (annualValue / i).toFixed(2).replace(".", ",")
    const option = document.createElement("option")
    option.value = i

    if (i === 1) {
      option.textContent = `1x de R$ ${installmentValue} (à vista)`
    } else {
      option.textContent = `${i}x de R$ ${installmentValue}`
    }

    select.appendChild(option)
  }
}

// PIX Functions
function generatePix() {
  // Hide form step and show generated step
  document.getElementById("pix-form-step").classList.add("hidden")
  document.getElementById("pix-generated-step").classList.remove("hidden")

  // Update final summary
  const annualPrice = selectedPlan.price * 12
  document.getElementById("pix-final-plan-name").textContent = selectedPlan.name
  document.getElementById("pix-final-plan-annual").textContent =
    `Equivale a 12x R$ ${selectedPlan.price.toFixed(2).replace(".", ",")}`
  document.getElementById("pix-final-annual-price").textContent = `R$ ${annualPrice.toFixed(2).replace(".", ",")}`
}

function copyPixCode() {
  const pixCode = document.getElementById("pix-code").textContent

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(pixCode)
      .then(() => {
        alert("Código PIX copiado para a área de transferência!")
      })
      .catch(() => {
        fallbackCopyTextToClipboard(pixCode)
      })
  } else {
    fallbackCopyTextToClipboard(pixCode)
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    alert("Código PIX copiado para a área de transferência!")
  } catch (err) {
    alert("Erro ao copiar código PIX. Copie manualmente.")
  }

  document.body.removeChild(textArea)
}

// Payment Processing
function processPayment() {
  // Simulate payment processing
  alert("Processando pagamento... Redirecionando para área do aluno!")

  // In a real application, you would:
  // 1. Validate form data
  // 2. Send payment information to your backend
  // 3. Process payment with payment gateway
  // 4. Redirect to success page or member area
}

// Form Validation and Formatting
document.addEventListener("DOMContentLoaded", () => {
  // Phone number formatting
  const phoneInputs = document.querySelectorAll('input[type="tel"]')
  phoneInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
      }
      e.target.value = value
    })
  })

  // Card number formatting
  const cardNumberInput = document.getElementById("cardNumber")
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
      e.target.value = value
    })
  }

  // Expiry date formatting
  const expiryInput = document.getElementById("expiry")
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 2) {
        value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2")
      }
      e.target.value = value
    })
  }

  // CVV formatting
  const cvvInput = document.getElementById("cvv")
  if (cvvInput) {
    cvvInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4)
    })
  }
})
