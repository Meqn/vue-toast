import Vue from 'vue'
import ToastOptions from './toast.vue'

// 默认属性
const defaultProps = {
  type: '',
  content: '',
  position: 'center',
  duration: 3000,
  hasMask: false,
  parentNode: document.body
}

const isObject = arg => Object.prototype.toString.call(arg) === '[object Object]'

const Toast = function(options = {}) {
  const propsData = Object.assign({}, defaultProps, options)
  const { parentNode } = propsData
  let vm = Toast._instance
  if (!vm) {
    const ToastConstructor = Vue.extend(ToastOptions)
    vm = Toast._instance = new ToastConstructor({
      propsData,
    }).$mount()
  }

  if (!vm.$el.parentNode) {
    parentNode.appendChild(vm.$el)
  }

  for (const key in propsData) {
    if (propsData.hasOwnProperty(key)) {
      vm[key] = propsData[key]
    }
  }

  vm.show()

  return vm
}

// There is only one toast singleton
Toast._instance = null

Toast.hide = () => {
  const ToastConstructor = Vue.extend(ToastOptions)
  if (Toast._instance instanceof ToastConstructor && Toast._instance.visible) {
    Toast._instance.hide()
  }
}

// 增加Toast不同类型方法
['info', 'success', 'error', 'warning', 'loading'].forEach(type => {
  Toast[type] = (content = '') => {
    let opts
    if (typeof content === 'string') opts = { content }
    else if (isObject(content)) opts = content
    else return console.error(`[Toast]: content must be string or object`)
    const typeProps = type === 'loading' ? {
      type,
      hasMask: true,
      duration: 0
    } : { type }
    return Toast(Object.assign(typeProps, opts))
  }
})

Toast.component = ToastOptions
Toast.install = function (Vue) {
  if (!Vue) return
  Vue.component(ToastOptions.name, ToastOptions)
  Vue.prototype.$toast = Toast
}

export default Toast
