<template>
  <div class="container page-content">
    <div class="with-sidebar">
      <AboutSidebar current-slug="documents" />
      <article class="page-body">
        <h1>Documents</h1>

        <div v-for="doc in documents" :key="doc.href" class="document-item">
          <a :href="doc.href">{{ doc.title }}</a>
          <a :href="doc.href" class="button compact" download>Download</a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Documents' })

const documents = [
  {
    title: 'DOXA Playbook – Access and Alignment',
    href: '/documents/DOXA-Playbook-Access-and-Alignment_email.pdf',
  },
  {
    title: 'DOXA Playbook Powerpoint Slides (PDF)',
    href: '/documents/DOXA-Playbook-Powerpoint-Slides-PDF.pdf',
  },
  {
    title: 'Vision and Values',
    href: '/documents/Vision-and-Values.docx',
  },
  {
    title: 'Introduction 2025',
    href: '/documents/Introduction-2025.pptx',
  },
  {
    title: 'Definitions',
    href: '/documents/Definitions-.docx',
  },
  {
    title: 'DOXA Endowment Investment Policy Statement',
    href: '/documents/DOXA-Endowment-Investment-Policy-Statement.docx',
  },
  {
    title: 'Español – Initial Proposal',
    href: '/documents/EspanTHol-Initial-Proposal.pdf',
  },
  {
    title: 'French – Initial Proposal',
    href: '/documents/French-Initial-Proposal.docx',
  },
]
</script>

<style scoped>
.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-brand-secondary-light);
}

.document-item a:first-child {
  flex: 1;
}
</style>
