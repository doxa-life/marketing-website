<template>
  <div class="container page-content">
    <div class="with-sidebar">
      <AboutSidebar current-slug="about" />
      <article class="page-body">
        <h2>Leadership</h2>

        <p>DOXA was started and is stewarded by the World Assemblies of God Fellowship (WAGF) and is overseen by the WAGF Missions Commission Lead Team.</p>

        <h2>Partners</h2>

        <p>Every World Assemblies of God Fellowship affiliated missions department (129 different sending agencies as of 2026) is automatically a DOXA partner. This is by virtue of the fact that DOXA serves the World Assemblies of God Fellowship as part of the Missions Commission. Any member of the WAGF missions commission is a partner that DOXA welcomes and serves.</p>

        <h2>2025 Declaration</h2>

        <h3 class="text-center">The DOXA Partnership</h3>

        <h3 class="text-center">SENDING SUMMIT DECLARATION</h3>

        <p class="text-center">Lake Geneva, Minnesota – September 25, 2025</p>

        <p>Recognizing that Jesus has called us to partnership, we commit ourselves to God and to one another to partner together globally for the greatest disciple making and church planting movement among the unreached that the World Assemblies of God Fellowship has ever seen. Our commitment includes the following:</p>

        <p>That we will remain reliant on the Holy Spirit and the Holy Scripture always and for everything;</p>

        <p>That we will humbly consider others better than ourselves and will not compete with each other or other agencies, but will respect and honor all God's people in His mission;</p>

        <p>That we will form a Voluntary, Global, Receiving Partnership committed to working with existing national churches and Assemblies of God General Councils wherever that is possible;</p>

        <p>That this partnership will not be a sending agency, nor is it replacing the work or role of current sending agencies or their national churches;</p>

        <p>That sending agencies may collaborate with the partnership to the level they desire. They may choose to send some or all or none of their missionaries through the partnership;</p>

        <p>That sending agencies will retain final authority over their missionaries, support them, and train them before they are sent to the field;</p>

        <p>That the partnership—at the invitation of the sending agency—can receive missionaries, train them on the field, coordinate team placement, and coach them strategically in the field;</p>

        <p>That the partnership will prioritize the fruitful, long-term, residential engagement of the world's unengaged peoples who currently do not have church planting teams among them with the long-term goal of planting indigenous churches that lead to national churches or integration into existing national churches. We will do this in harmony with MM33;</p>

        <p>That the partnership will also empower missionaries for the fruitful, long-term, residential engagement of frontier peoples (less than 1 believer in 1,000), under-engaged peoples (less than 1 believer in 100), and the generally unreached (less than 2 believers in 100);</p>

        <p>That the partnership will be stewarded by the Missions Commission of the World Assemblies of God Fellowship who will appoint and oversee the partnership leaders who may come from any country or agency in the partnership;</p>

        <p>That the partnership will be called "Doxa" which is the Greek word for "glory" and this name will remind us that Jesus is worthy of glory from every tribe, tongue, people, and nation;</p>

        <p>That we will partner with all of God's church to take all of God's gospel to all of God's world;</p>

        <p>That one day there will be a multitude of every people around the throne worshipping God;</p>

        <p>That Jesus alone will receive all the glory.</p>

        <p class="text-center"><strong>In faith and by God's grace affirmed this 25<sup>th</sup> day of September 2025.</strong></p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: 'default' })
useHead({ title: t('nav.about') })
</script>
