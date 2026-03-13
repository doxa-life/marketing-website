class BaseMigration {
  async exec(sql, query) {
    await sql.unsafe(query)
  }

  async tableExists(sql, tableName) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      ) as exists
    `
    return result[0]?.exists || false
  }
}

export default class SeedAboutPages extends BaseMigration {
  id = 2
  name = 'Seed About pages'

  async up(sql) {
    const existing = await sql`SELECT id FROM pages WHERE slug = 'about' AND language = 'en' LIMIT 1`
    if (existing.length > 0) {
      console.log('About pages already seeded, skipping')
      return
    }

    console.log('🔄 Seeding About pages...')

    await sql`INSERT INTO pages (slug, parent_slug, language, title, content_html, menu_order) VALUES
      ('about', NULL, 'en', 'About', ${aboutHtml}, 0),
      ('vision', 'about', 'en', 'Vision', ${visionHtml}, 1),
      ('documents', 'about', 'en', 'Documents', ${documentsHtml}, 2),
      ('definitions', 'about', 'en', 'Definitions', ${definitionsHtml}, 3),
      ('statement-of-faith', 'about', 'en', 'Statement of Faith', ${statementOfFaithHtml}, 4)
    `

    console.log('✅ About pages seeded successfully!')
  }
}

const aboutHtml = `<h2>Leadership</h2>

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

<p class="text-center"><strong>In faith and by God's grace affirmed this 25<sup>th</sup> day of September 2025.</strong></p>`

const visionHtml = `<h2>Vision</h2>

<div class="scripture-block surface-brand">
  <h5 class="font-size-lg">A great multitude of all nations and families and peoples and tongues standing before the Lamb.</h5>
  <h5 class="text-right">&ndash; Revelation 7:9</h5>
</div>

<h2>Mission</h2>

<div class="scripture-block surface-brand">
  <h5 class="font-size-lg">For the glory of God, to make disciples of all the nations by going, baptizing, and teaching.</h5>
  <h5 class="text-right">&ndash; Matthew 28:19-20</h5>
</div>

<h2>Priority</h2>

<p>To engage every Unengaged People Group by 2033</p>

<h2>Values</h2>

<ul>
  <li>Abide in Jesus (John 15:5)</li>
  <li>Pray without ceasing (1 Thessalonians 5:17)</li>
  <li>Deny yourself (Luke 9:23)</li>
  <li>Engage the regions beyond (2 Corinthians 10:16)</li>
</ul>

<h2>Goals</h2>

<h3>Prayer</h3>

<ol>
  <li>Daily prayer for each of the 2,085 UUPGs</li>
  <li>At least 144 intercessors praying for each UUPG 10 minutes a day (which equals 24-hour prayer coverage)</li>
  <li>Over 1,000 intercessors for each UUPG (2,085,000+ intercessors)</li>
</ol>

<h3>Engagement</h3>

<ol>
  <li>By 2033 every unengaged people group is engaged</li>
  <li>Post 2033 every unreached people group on earth is fruitfully engaged</li>
  <li>There is an indigenous church planted among every people group on earth</li>
</ol>

<h3>What is Engagement?</h3>

<ul>
  <li>There is sustained activity* to share Christ and make disciples</li>
  <li>There are efforts to establish self-sustaining churches</li>
  <li>The work occurs in culturally appropriate and locally relevant ways</li>
</ul>

<p><em>* For WAGF understanding, this means cross-cultural workers are resident&hellip;</em></p>`

const documentsHtml = `<h1>Documents</h1>

<div class="document-item">
  <a href="/documents/DOXA-Playbook-Access-and-Alignment_email.pdf">DOXA Playbook – Access and Alignment</a>
  <a href="/documents/DOXA-Playbook-Access-and-Alignment_email.pdf" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/DOXA-Playbook-Powerpoint-Slides-PDF.pdf">DOXA Playbook Powerpoint Slides (PDF)</a>
  <a href="/documents/DOXA-Playbook-Powerpoint-Slides-PDF.pdf" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/Vision-and-Values.docx">Vision and Values</a>
  <a href="/documents/Vision-and-Values.docx" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/Introduction-2025.pptx">Introduction 2025</a>
  <a href="/documents/Introduction-2025.pptx" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/Definitions-.docx">Definitions</a>
  <a href="/documents/Definitions-.docx" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/DOXA-Endowment-Investment-Policy-Statement.docx">DOXA Endowment Investment Policy Statement</a>
  <a href="/documents/DOXA-Endowment-Investment-Policy-Statement.docx" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/EspanTHol-Initial-Proposal.pdf">Español – Initial Proposal</a>
  <a href="/documents/EspanTHol-Initial-Proposal.pdf" class="button compact" download>Download</a>
</div>
<div class="document-item">
  <a href="/documents/French-Initial-Proposal.docx">French – Initial Proposal</a>
  <a href="/documents/French-Initial-Proposal.docx" class="button compact" download>Download</a>
</div>`

const definitionsHtml = `<h2>Church</h2>

<p>A <strong>church</strong> is comprised of baptized disciples joined together by the Holy Spirit who regularly meet together for doctrine, fellowship, communion, and prayer (Acts 2:42).</p>

<p>Practically speaking, for a new gathering to be called a church, at least six baptized disciples are required; however, specific location, meeting frequency, and designated pastor are not—though those normally develop as an indigenous church matures in the five "selfs" (self-propagating, self-governing, self-supporting, self-theologizing, self-missionizing).</p>

<p>A <strong>church-planting movement</strong> is a multiplication of indigenous churches planting churches that includes at least four streams of four spiritual generations together totaling more than 1,000 persons.</p>

<h2>People Group</h2>

<p>A <strong>people group</strong> is an ethnolinguistic group who perceive themselves to have a common affinity for one another based on language, culture, religion, and worldview. From the viewpoint of evangelization, it is the largest possible group within which the gospel can spread as a viable, indigenous church-planting movement without encountering barriers of understanding or acceptance.</p>

<p>An <strong>unreached people group (UPG)</strong> has approximately 2 disciples or fewer out of 100 (&le; 2%) and lacks the capacity to establish indigenous churches without cross-cultural assistance.</p>

<p>Within the overarching UPG category are the following people groups in descending levels of engagement:</p>

<ol>
  <li><strong>Under-Engaged.</strong> An <em>under-engaged people group</em> has approximately 1 disciple or fewer out of 100 (&le; 1%). More church planting teams are needed to increase fruitful engagement.</li>
  <li><strong>Frontier.</strong> A <em>frontier people group</em> has approximately 1 disciple or fewer out of 1,000 (&le; 0.1%) with no confirmed, sustained movement to Jesus. These groups are often geographically isolated with little to no access to the gospel; thus, pioneer work generally must begin with nonbelievers.</li>
  <li>
    <strong>Unengaged.</strong> An <em>unengaged UPG (UUPG)</em> has no known believers or a tiny few (effectively 0%) and lacks the four primary levels of effective engagement:
    <ul>
      <li>Apostolic (pioneering) effort in residence</li>
      <li>Commitment to work in the local culture and heart language</li>
      <li>Commitment to long-term ministry</li>
      <li>Sowing the gospel in a manner consistent with the goal of seeing a church-planting movement emerge</li>
    </ul>
  </li>
</ol>

<p>Broader engagement includes important contributing components that can be done by nonresident partners, including intercessory prayer, Bible translation, compassion/disaster ministry outreaches, media reach, mobilization efforts, leadership training, and work among diaspora.</p>`

const statementOfFaithHtml = `<h2>World Assemblies of God</h2>

<p>This Statement of Faith is intended simply as a basis for belief, fellowship, and cooperation among us. The phraseology employed in this statement is not inspired, but the truth set forth is held to be essential to a truly Pentecostal ministry. No claim is made that it contains all biblical truth, only that it covers our need for these essential doctrines.</p>

<h3>1. THE INSPIRATION OF THE SCRIPTURES</h3>

<p>We believe that the Scriptures, both the Old and New Testaments, are verbally inspired of God and are the revelation of God to man, the infallible, authoritative rule of faith and conduct. Divine inspiration extends equally and fully to all parts of the original writings, insuring their entire trustworthiness (2 Timothy 3:15-17; 2 Peter 1:21).</p>

<h3>2. THE ETERNAL GODHEAD</h3>

<p>We believe in the unity of the one true and living God who is the eternal, self-existent One, and has revealed Himself as one being in three persons: Father, Son, and the Holy Spirit (Matthew 3:16-17; 28:19).</p>

<h4>a. God the Father</h4>

<p>We believe in God the Father, the first person of the triune Godhead, who exists eternally as the Creator of heaven and earth, the Giver of the Law, to whom all things will be subjected, so that He may be all in all (Genesis 1:1; Deuteronomy 6:4; 1 Corinthians 15:28).</p>

<h4>b. The Lord Jesus Christ</h4>

<p>We believe in the Lord Jesus Christ, the second person of the triune Godhead, who was and is the eternal Son of God; that He became incarnate by the Holy Spirit and was born of the virgin Mary. We believe in His sinless life, miraculous ministry, substitutionary atoning death, bodily resurrection, triumphant ascension, and abiding intercession (Isaiah 7:14; Hebrews 7:25-26; 1 Peter 2:22; Acts 1:9; 2:22; 10:38; 1 Corinthians 15:4; 2 Corinthians 5:21).</p>

<h4>c. The Holy Spirit</h4>

<p>We believe in the Holy Spirit, the third person of the triune Godhead, who proceeds from the Father and the Son, and is ever present and active in the work of convicting and regenerating the sinner, sanctifying the believer, leading into all truth and empowering for ministry (John 14:26; 16:8-11; 1 Peter 1:2; Romans 8:14-16).</p>

<h3>3. THE FALL OF MAN</h3>

<p>We believe that humankind was created good and upright. However, voluntary transgression resulted in their alienation from God, thereby incurring not only physical death but spiritual death, which is separation from God (Genesis 1:16-27; 2:17; 3:6; Romans 5:12-19).</p>

<h3>4. THE SALVATION OF MAN</h3>

<p>We believe in salvation through faith in Christ, who died for our sins, was buried, and was raised from the dead on the third day. By His atoning blood, salvation has been provided for all humanity through the sacrifice of Christ upon the cross. This experience is also known as the new birth, and is an instantaneous and complete operation of the Holy Spirit whereupon the believing sinner is regenerated, justified, and adopted into the family of God, becomes a new creation in Christ Jesus, and heir of eternal life (John 3:5-6; Romans 10:8-15; Titus 2:11, 3:4-7; 1 John 5:1).</p>

<h3>5. DIVINE HEALING</h3>

<p>We believe that deliverance from sickness is provided in the atonement and is the privilege of all believers (Isaiah 53:4-5; Matthew 8:16-17; James 5:14-16).</p>

<h3>6. THE CHURCH AND ITS MISSION</h3>

<p>We believe that the church is the body of Christ and the habitation of God through the Spirit, witnesses to the presence of the kingdom of God in the present world, and universally includes all who are born again (Ephesians 1:22-23; 2:22; Romans 14:17-18; 1 Corinthians 4:20).</p>

<p>We believe that the mission of the church is to (1) proclaim the good news of salvation to all humankind, (2) build up and train believers for spiritual ministry, (3) praise the Lord through worship, (4) demonstrate Christian compassion to all who suffer, and (5) exhibit unity as the body of Christ (Matthew 28:19-20; 10:42; Ephesians 4:11-13).</p>

<h3>7. THE ORDINANCES OF THE CHURCH</h3>

<p>We believe that baptism in water by immersion is expected of all who have repented and believed. In so doing they declare to the world that they have died with Christ and been raised with Him to walk in newness of life (Matthew 28:19; Acts 10:47-48; Romans 6:4).</p>

<p>We believe that the Lord&rsquo;s Supper is a proclamation of the suffering and death of our Lord Jesus Christ, to be shared by all believers until the Lord returns (Luke 22:14-20; 1 Corinthians 11:20-34).</p>

<h3>8. SANCTIFICATION</h3>

<p>We believe that sanctification is an act of separation from that which is evil, and of dedication unto God. In experience, it is both instantaneous and progressive. It is produced in the life of the believer by his appropriation of the power of Christ&rsquo;s blood and risen life through the person of the Holy Spirit. He draws the believer&rsquo;s attention to Christ, teaches him through the Word and produces the character of Christ within him (Romans 6:1-11; 8:1-2,13; 12:1-2; Galatians 2:20; Hebrews 10:10, 14).</p>

<h3>9. THE BAPTISM IN THE HOLY SPIRIT</h3>

<p>We believe that the baptism in the Holy Spirit is the bestowing of the believer with power for life and service for Christ. This experience is distinct from and subsequent to the new birth, is received by faith, and is accompanied by the manifestation of speaking in tongues as the Spirit gives utterance as the initial evidence (Luke 24:49; Acts 1:8; 2:1-4; 8:15-19; 11:14-17; 19:1-7).</p>

<h3>10. THE GIFTS OF THE HOLY SPIRIT</h3>

<p>We believe in the present-day operation of the nine supernatural gifts of the Holy Spirit (1 Corinthians 12) and the ministry gifts of Christ (Ephesians 4:11-13) for the edification and expansion of the church.</p>

<h3>11. THE END OF TIME</h3>

<p>We believe in the pre-millennial, imminent, and personal return of our Lord Jesus Christ to gather His people unto Himself. Having this blessed hope and earnest expectation, we purify ourselves, even as He is pure, so that we may be ready to meet Him when He comes (John 14:1-3; Titus 2:13; 1 Thessalonians 4:15-17; 1 John 3:2-3; Revelation 20:1-6).</p>

<p>We believe in the bodily resurrection of all humanity, the everlasting conscious bliss of all who truly believe in our Lord Jesus Christ, and that everlasting conscious punishment is the portion of all whose names are not written in the Book of Life (John 5:28-29; 1 Corinthians 15:22-24; Revelation 20:10-15).</p>`
