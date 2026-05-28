<script setup lang="ts">
interface Props {
  size?: `${number}px` | `${number}rem` | `${number}%` | `${number}vw`
  faceColor?: string       
  strokeColor?: string     
  eyeGreen?: string       
  eyePupilColor?: string  
  mouthColor?: string      
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: '300px',
  faceColor: '#FDD114',
  strokeColor: '#0000005c',
  eyeGreen: '#478421',
  eyePupilColor: '#051507ec',
  mouthColor: '#E69D9B',
  duration: 2
})
</script>

<template>
  <div 
    class="relative rounded-full border-2 aspect-square shadow-md transition-all"
    :style="{ 
      width: props.size, 
      height: props.size, 
      backgroundColor: props.faceColor, 
      borderColor: props.strokeColor 
    }"
  >
    <div 
      class="eye left-[15%] absolute flex items-center justify-center rounded-full shadow-sm"
      :style="{ backgroundColor: props.eyeGreen }"
    >
      <div 
        class="pupil absolute rounded-full shadow-inner" 
        :style="{ backgroundColor: props.eyePupilColor }"
      />
    </div>

    <div 
      class="eye right-[15%] absolute flex items-center justify-center rounded-full shadow-sm"
      :style="{ backgroundColor: props.eyeGreen }"
    >
      <div 
        class="pupil absolute rounded-full shadow-inner" 
        :style="{ backgroundColor: props.eyePupilColor }"
      />
    </div>
  </div>
</template>

<style scoped>
.eye {
  width: 24%;
  height: 24%;
  top: 35%;
}
.pupil {
  width: 50%;
  height: 50%;
  top: 40%;
}
</style>
