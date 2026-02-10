<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '../../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  
  // CORRECCIÓN AQUÍ:
  // Reset errors con type assertion
  Object.keys(errors).forEach(key => (errors as any)[key] = '')

  // Validaciones simples
  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'El email es requerido'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Mínimo 8 caracteres'
    isValid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  if (!form.acceptTerms) {
    alert('Debes aceptar los términos y condiciones')
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  authStore.clearError()

  const result = await authStore.register(
    form.name,
    form.email,
    form.password
  )

  if (result.success) {
    // Redirigir a dashboard o página de bienvenida
    await router.push('/dashboard')
  }
  
  isLoading.value = false
}
</script>