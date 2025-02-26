<template>
  <span :class="{ 'german-text': hasGermanChars }">{{ processedText }}</span>
</template>

<script>
import { computed } from 'vue';
import { replaceEszett } from '../utils/textUtils';

export default {
  name: 'TextComponent',
  props: {
    text: {
      type: String,
      required: true
    },
    autoReplaceEszett: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const processedText = computed(() => {
      if (props.autoReplaceEszett) {
        return replaceEszett(props.text);
      }
      return props.text;
    });
    
    const hasGermanChars = computed(() => {
      return /[äöüÄÖÜß]/.test(props.text);
    });
    
    return {
      processedText,
      hasGermanChars
    };
  }
}
</script>
