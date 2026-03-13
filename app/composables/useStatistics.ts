export function useStatistics() {
  const stats = ref({
    total_with_prayer: 0,
    total_with_full_prayer: 0,
    total_adopted: 0,
    people_committed: 0,
    committed_duration: 0,
  })

  const fetchStats = async () => {
    try {
      const data = await $fetch<any>('https://pray.doxa.life/api/people-groups/statistics')
      stats.value = {
        total_with_prayer: Number(data.total_with_prayer || 0),
        total_with_full_prayer: Number(data.total_with_full_prayer || 0),
        total_adopted: Number(data.total_adopted || 0),
        people_committed: Number(data.people_committed || 0),
        committed_duration: Number(data.committed_duration || 0),
      }
    } catch (e) {
      console.error('Failed to fetch statistics', e)
    }
  }

  return { stats, fetchStats }
}
