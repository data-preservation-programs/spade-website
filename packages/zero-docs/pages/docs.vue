<script setup>
// ===================================================================== Imports
import Sidebar from '@/data/sidebar.json'

// ======================================================================= Setup
await navigateTo(`/${Sidebar[0].slug}${Sidebar[0].children[0].href}`)
</script>
