<template>
  <div class="border-l-4 pt-4 pr-4 pl-4 pb-2" :class="[getBgColor()]">
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon v-if="variant === 'success'" class="h-5 w-5" :class="[getTextColor()]" aria-hidden="true" />

        <XCircleIcon v-if="variant === 'danger'" class="h-5 w-5" :class="[getTextColor()]" aria-hidden="true" />

        <ExclamationCircleIcon
            v-if="variant === 'warning'"
            class="h-5 w-5"
            :class="[getTextColor()]"
            aria-hidden="true"
        />

        <InformationCircleIcon v-if="variant === 'info'" class="h-5 w-5" :class="[getTextColor()]" aria-hidden="true" />

        <InformationCircleIcon
            v-if="variant === 'primary'"
            class="h-5 w-5"
            :class="[getTextColor()]"
            aria-hidden="true"
        />
        <InformationCircleIcon
            v-if="variant === 'secondary'"
            class="h-5 w-5"
            :class="[getTextColor()]"
            aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <slot name="title">
          <h3 :class="[getTitleColor()]" v-if="title" class="text-sm font-medium mb-2">{{ title }}</h3>
        </slot>

        <p :class="[getTextColor()]" class="text-sm"><slot></slot></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/20/solid";

const props = defineProps<{
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  title?: string;
}>();

const getBgColor = () => {
  switch (props.variant) {
    case "primary":
      return "bg-indigo-50 border-indigo-400";
    case "secondary":
      return "bg-gray-50 border-gray-400";
    case "success":
      return "bg-green-50 border-green-400";
    case "danger":
      return "bg-red-50 border-red-400";
    case "warning":
      return "bg-yellow-50 border-yellow-400";
    case "info":
      return "bg-blue-50 border-blue-400";
  }
};

const getTitleColor = () => {
  switch (props.variant) {
    case "primary":
      return "text-indigo-800";
    case "secondary":
      return "text-gray-800";
    case "success":
      return "text-green-800";
    case "danger":
      return "text-red-800";
    case "warning":
      return "text-yellow-800";
    case "info":
      return "text-blue-800";
  }
};

const getTextColor = () => {
  switch (props.variant) {
    case "primary":
      return "text-indigo-700";
    case "secondary":
      return "text-gray-700";
    case "success":
      return "text-green-700";
    case "danger":
      return "text-red-700";
    case "warning":
      return "text-yellow-700";
    case "info":
      return "text-blue-700";
  }
};
</script>