<template>
<transition name="app-toast-fade">
  <div v-show="visible" :class="['app-toast']">
    <div v-show="hasMask" class="app-toast-mask"></div>
    <div :class="['app-toast-content', position]" :style="{ backgroundColor: backgroundColor }">
      <slot>
        <ToastIcon v-if="type" :type="type" :color="iconColor" size="18" class="toast-icon" />
        <span class="toast-text" v-text="content || 'Toast!'" :style="{ color: textColor }"></span>
      </slot>
    </div>
  </div>
</transition>
</template>

<script>
import ToastIcon from './icon'
export default {
  name: 'app-toast',
  components: {
    ToastIcon
  },
  props: {
    type: {
      type: String
    },
    content: [String, Number],
    position: {
      type: String,
      validator(val) {
        return ['top', 'center', 'bottom'].indexOf(val) !== -1
      },
      default: 'center'
    },
    duration: {
      type: Number,
      default: 0,
    },
    hasMask: Boolean,
    iconColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: String,
    backgroundColor: String
  },
  data() {
    return {
      visible: false
    }
  },
  beforeDestroy() {
    if (this.$_timer) {
      clearTimeout(this.$_timer)
    }
  },
  methods: {
    fire() {
      if (this.$_timer) {
        clearTimeout(this.$_timer)
      }
      if (this.visible && this.duration) {
        this.$_timer = setTimeout(() => {
          this.hide()
        }, this.duration)
      }
    },
    show() {
      this.visible = true
      this.fire()
    },
    hide() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.app-toast{
  position: fixed; z-index: 999;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;

  &-mask{
    position: absolute; z-index: 1;
    top: 0; right: 0; bottom: 0; left: 0;
    pointer-events: auto;
    background-color: rgba(37, 38, 45, .7);
  }
  &-content{
    position: absolute; z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    
    box-sizing: border-box;
    overflow: hidden;
    pointer-events: auto;
    
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    max-width: 100%;
    max-height: 100%;
    
    padding: 20px 32px;
    border-radius: 4px;
    font-size: 28px;
    text-align: left;
    line-height: 1.42857142;
    color: #fff;
    background-color: rgba(65,72,93,.77);

    .toast-icon{
      margin-right: 16px;
    }
    .toast-text{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    &.top{
      top: 120px;
    }
    &.bottom{
      bottom: 120px;
    }
    &.center{
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }

  &-fade-enter{
    opacity: 0;
  }
  &-fade-enter-active {
    transition: all .4s ease;
  }
  &-fade-leave{
    opacity: 1;
  }
  &-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    opacity: 0;
  }
}
</style>
