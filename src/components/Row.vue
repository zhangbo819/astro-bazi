<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="row">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;
}
</style>
