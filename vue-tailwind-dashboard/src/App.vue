<template>
  <div id="app-container" class="antialiased text-slate-700">
    <AppHeader />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <ConfirmationModal />
    <TransactionForm />
    <!-- TransactionForm might be better handled locally in views that need it,
         or its visibility controlled by a global store.
         For now, including it here if its state is managed globally as in original.
         Alternatively, remove from here and place where 'showTransactionForm' is managed. -->
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
// Assuming ConfirmationModal and TransactionForm state will be managed via a store or provide/inject later
// For now, let's assume they are self-contained or will be connected to a store
import ConfirmationModal from './components/ConfirmationModal.vue';
import TransactionForm from './components/TransactionForm.vue';

// It's good practice to define transitions in a global CSS or here if scoped
</script>

<style>
/* Global transitions (can also be in assets/css/main.css) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
