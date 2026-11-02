export const home = {
  introText1: `<b>Welcome to the Virtual Rocky Shore Sampling Unit.</b><br />
        Learn how ecologists prepare for shore surveys, collect representative quadrat samples, and interpret abundance data.`,
  userFlow: `Follow the <b>student field guide</b> to review the method, explore a real sample dataset, or plot counts from your own survey spreadsheet. The current learning path uses field photographs, worked examples, and browser-based data tools; it does not simulate moving around a virtual shore.`,
};

export const intro = {
  introExtra: `
        <p>Rocky shores are intertidal areas with predominantly rock substrata. Bridging the land and the ocean, this habitat
            periodically alternates between aquatic conditions (as the tide rises) and aerial conditions (as the tide falls),
            resulting in great spatial (e.g. across tidal heights) and temporal (e.g. across hours, days and seasons) variations
            in the physical environment. Despite being such a dynamic habitat, rocky shores harbour a great abundance and
            diversity of species that are adapted to survive these changing conditions which are intriguing to biologists
            worldwide and rocky shores are therefore used as “natural laboratories” to study the distribution and abundance of
            organisms.</p>
        `,
  introP1: `The very first step to study an ecological community is to assess the distribution and abundance of organisms within that habitat and, to achieve this, some forms of ecological survey are needed. <b>This sounds very easy, but in fact it is quite difficult to gain representative and reliable measures as there are many errors we can make when doing this.</b> To try and illustrate this, and show ways to avoid these errors, this website will focus on basic surveying techniques and appropriate sampling designs on rocky shores.`,
  introP2: `Whilst counting every single individual on the shore would be the most complete way of measuring the distribution and abundance of species, no one actually does this because of the huge amount of time and manpower which would be needed (see the above photos - intertidal organisms can occur in great abundance and density!). Instead, <b>we take a series of samples (replicate units in which we can count the abundance of organisms, in this case quadrats) along the shore.</b>`,
  introP3: `If we take enough of these samples then we can calculate descriptive statistics like the average (mean) abundance of individuals and variation around this value. <b>The real question is then how many of these samples do we have to take to be representative of the real population?</b> We also need to consider where we place these sample that we count; and how we count them to ensure that our samples are accurate (i.e. they give representative measures of species’ abundance at a location) and that the methods are repeatable (so other researchers can follow the method and achieve the same results). We should, therefore, be careful and aware of the many errors we can commit when conducting such surveys because we want to ensure that <b>the data we collect is representative of the population, and the methods we use are repeatable</b>. By following the protocols we outline we hope you can avoid some of these errors and, using your data and our simulations, you can explore how many samples you need to gain a representative estimate of the population abundance of different species at a certain location.`,
};

export const physicalEnv = {
  p1: 'The intertidal zone is defined by the rise and fall of the tides, which create a dynamic vertical gradient between the sea and the land. Tide tables summarise predicted seawater heights through the day, showing when the flowing tide submerges the shore and when the ebbing tide exposes it again.',
  p1b: 'One tidal cycle runs from low water (most of the shore in air) to high water (most of the shore submerged) and back. Some coasts have one tide a day (diurnal); others have two (semidiurnal). Tidal amplitude also varies—from a few centimetres in places such as the Mediterranean to about 14 metres in the Bay of Fundy. Monthly lunar and seasonal patterns further change timing and range (spring tides near new and full moon; neap tides near half moon).',
  p2: `This vertical gradient is often described as the <b>high intertidal</b> (near land; short submersion or wave wetting), the <b>mid intertidal</b> (roughly half the time in air and half submerged), and the <b>low intertidal</b> (mostly submerged; uncovered only briefly). See the shore diagram below.`,
  p3: 'Wave exposure also shapes which organisms can live on a shore. Exposure depends on geology, shore aspect, fetch, and shelter from islands or bays. Open headlands can be pounded by large waves and favour sessile filter feeders that stay attached; more sheltered rocky shores often support more mobile species, and in temperate regions algae may proliferate. A simple qualitative scale—exposed, semi-exposed, sheltered—is often enough for comparative work, remembering that storms, typhoons, or hurricanes can briefly create far more destructive waves than the average condition.',
  p4: 'Safety comes first. Do not work on highly exposed shores or in windy and stormy conditions. If there is any doubt whether it is safe, do not go onto the shore.',
};

export const materials = {
  preparation: `
        <li>It is important to be prepared for all eventualities!</li>
        <li>Have your equipment checked and ready.</li>
        <li><b>ALWAYS</b> check the tidal conditions and weather before your trip</li>
        <li>Visit the shore as the tide is dropping and know what time the tide will start to rise so you can leave the shore safely and you have enough time for your work.</li>
        <li>Be prepared for the local weather conditions. Leave the shore <b>IMMEDIATELY</b> if weather conditions deteriorate (e.g. storms, heavy rain etc). You should <b>NEVER</b> go to the shore if these conditions are anticipated.</li>
        <li><b>DO NOT</b> go to the shore alone and always inform someone where you are going, and when you will return.</li>`,
  materialsP1: `
            <li>A 50 m transect tape to place along the contour of the rock at fixed tidal heights</li>
            <li>A sampling unit, in our case a 50 cm × 50 cm quadrat</li>
            <li>A 50 cm × 50 cm double-strung quadrat / digital camera</li>
            <li>Datasheet and clipboards</li>
            <li>Pencils/pens</li>
            <li>Forceps</li>
            <li>Trays for temporarily holding organisms (but remember to put them back to their original location after examination)</li>
            <li>Cross-staff or other means to level the shore into different tidal heights</li>
            <li>Chalk (to mark tidal levels on the shore)</li>
            <li>Species identification guides / guide books</li>
            <li>Random number table</li>
            <li><strong><i>A set of spare items listed above</i></strong></li>
            `,
  materialsP2: `
                <li>Clothes that can get wet and are suitable for the weather that you will experience on the shore/spare clothes to change into</li>
                <li>Protective shoes that can get wet, have a strong grip and cover your toes (no sandals!)</li>
                <li>Hat, sunscreen and mosquito repellent (depending on local conditions)</li>
                <li>Gloves</li>
                <li>Snacks and plenty of drinks (mineral water is the best)</li>
            `,
  materialsP3: `
                <li>Camera (waterproof)</li>
                <li>Collection vials (if necessary)</li>
            `,
};

export const protocol = {
  measureP1:
    'The distribution and abundance of species on rocky shores is heavily influenced by the rise and fall of the tides. As a result of the tidal cycle, for some time of the day the shore is out of water and in air (and this is the time you want to conduct your surveys) but, as the tide comes in, the shore is flooded with seawater. The tidal cycle therefore creates a strong environmental gradient from low to high shore in terms of physical, chemical and biological properties. Species have adapted to live at certain locations on this vertical gradient and so we tend to measure their abundance at specific tidal heights along this gradient, which allows us to identify their distribution but also to consider the environmental and biological factors which may be shaping their distribution.',
  measureP2: `In Hong Kong, tidal levels are described with reference to a standard height, called Chart Datum (C.D., i.e. the level of the lowest astronomical tide which is 0&nbsp;m; tidal heights are then measured above or below this mark). Tides in Hong Kong generally range from ~0.2 to 2.8&nbsp;m + C.D. If we want to survey species distribution along this tidal gradient, the first step is to level the shore into different tidal heights. One simple way to measure the tidal height of a particular point on a shore is to make use of the real-time water level (i.e. the real-time tide, as provided by the
                    <a href="https://www.hko.gov.hk/en/tide/marine/realtide.htm" target="_blank" rel="noopener">
                      Hong Kong Observatory</a>; see <a href="#fig-1">Fig. 1</a> for an example). From these graphs you will be able to see the height of the tide at the location nearest to your site at the time when you are there.
                  `,
  measureP3:
    'Once you have established what height the water is currently at, you can <b>estimate higher tidal heights for survey transects</b> by <b>measuring the vertical difference from the transect marks to the real-time water level</b> (<a href="#fig-2">Fig. 2</a>). In the example shown we use the observed water level to measure the remaining vertical distance needed to establish a point at 1.5&nbsp;m above C.D., and we mark these heights on the shore with chalk. Once we establish a series of points at this height we can link them with the tape measure, carefully following the height contour of the rock to establish a transect line for positioning samples.',
  surveyP1: `<p>Taking our surveys as an example, a 15-meter transect line will be set up at 1.5&nbsp;m + C.D. (the mid-shore height in Hong Kong), along which we shall place replicate sample units, in this case 50&nbsp;cm × 50&nbsp;cm quadrats.</p>

        <p>So how do we decide where to place these sampling units? We need to ensure they are repeatable and representative, so we cannot choose where they will be placed (as this might introduce a bias—perhaps we choose somewhere with many animals to count, or somewhere with very few because that feels quicker). <b>To avoid this bias, we place the quadrats randomly along the transect based on numbers drawn from a random number table</b> <a href="https://www.random.org/" target="_blank" rel="noopener">(you can generate your own from random.org)</a>.</p>

        <p>It is important that the exact position of all quadrats is standardised to avoid placement errors. In this case we place the quadrats above the transect with their bottom-left corners touching the randomly selected location along the line (<a href="#fig-3">Fig. 3</a>). This procedure standardises quadrat placement and makes the method repeatable between researchers. Without these decisions, different researchers could position the quadrat in many different ways along the transect line (<a href="#fig-4">Fig. 4</a>) and, when we compare these data, they could differ because of placement method rather than because species abundance differs!</p>`,
  surveyP2: `Once we have located the position of the quadrat along the transect, how should we count the organisms inside the quadrat? Again, to ensure consistency between investigators, we need clear decisions that make the methods repeatable and the results reliable. For mobile animals (e.g. limpets, crabs), we count abundance as numbers of individuals. For simplicity, to standardise sampling effort and reduce bias, we count mobile organisms that are <u>completely contained</u> within the quadrat (i.e. we do not count individuals where parts of the body lie under the quadrat frame; see <a href="#fig-5">Fig. 5</a>). For sessile organisms (e.g. algae, cyanobacteria colonies, barnacles, oysters), we score percentage cover on the rock surface inside the quadrat (because it is often difficult to identify individuals in dense colonies). One simple way to do this is with a 100-point double-strung quadrat (see <a href="#fig-6">Fig. 6</a>), aligning the two grid layers in sight to reduce parallax error. Another quick method is to take a high-resolution photograph under standardised conditions (camera height, direction, lighting) and analyse it later with software such as <a
        href="https://imagej.nih.gov/ij/" target="_blank" rel="noopener">ImageJ</a>.`,
};

export const howToExplore = {
  textBeforePlot: `
    <p>Choose a species from the list, then increase the number of quadrats you “sample” (try 1–5 first). Plot the running mean with ± SD or ± SE to see how estimates change with effort.</p>
    <p>Ask yourself: do your samples look representative yet? Are the mean and variation still jumping around?</p>
    <p>Add about 10 more quadrats, then continue in sets of ~10. Watch whether the mean stabilises and how SD and SE behave.</p>
    <p>Compare common vs rare, or evenly vs clumped species — patterns of sampling effort differ between them.</p>
  `,
};

export const whatWeLearn = {
  text: `
    <p>Running-mean graphs help you judge whether the quadrats sampled so far give a reasonably stable abundance estimate. With only a few quadrats, the mean and its error bars can change sharply; adding quadrats usually makes the pattern easier to interpret.</p>
    <p>SD and SE answer different questions. SD describes variation among quadrats, while SE describes uncertainty in the estimated mean. A small SE does not mean the shore itself is uniform, and a line that appears stable is evidence about this sample—not proof that every part of the shore has been captured.</p>
    <p>Patterns are species-specific. Common, evenly distributed species may stabilise sooner than rare or highly clumped species, so the same sampling effort is not automatically adequate for every species.</p>
  `,
};

export const resources = {
  generalInfo: `<p>Check the tides and weather at…</p>
    <ul>
    <li><a href="https://www.tide-forecast.com/" target="_blank" rel="noopener">Tide-forecast.com</a></li>
    <li><a href="https://www.windy.com/" target="_blank" rel="noopener">Wind conditions and forecasts</a></li>
    </ul>
    <p>Generate your random number table at…</p>
    <ul>
    <li><a href="https://www.random.org/" target="_blank" rel="noopener">Random number generator</a></li>
    </ul>
    <p>Look up species information at…</p>
    <ul>
    <li><a href="https://www.marinespecies.org/" target="_blank" rel="noopener">World Register of Marine Species</a></li>
    <li><a href="https://www.algaebase.org/" target="_blank" rel="noopener">AlgaeBase</a></li>
    </ul>
    <p>Analyse quadrat photos using…</p>
    <ul>
    <li><a href="https://imagej.nih.gov/ij/index.html" target="_blank" rel="noopener">ImageJ</a></li>
    <li><a href="https://cnso.nova.edu/cpce/index.html" target="_blank" rel="noopener">CPCe (Coral Point Count with Excel extensions)</a></li>
    </ul>
    <p>Extra reading…</p>
    <ul>
    <li>Colin Little, Gray A. Williams and Cynthia Trowbridge (2009). <b>The biology of rocky shores</b>. Oxford University Press.</li>
    <li>A. J. Underwood (1997). <b>Experiments in ecology — Their logical design and interpretation using analysis of variance</b>. Cambridge University Press.</li>
    </ul>`,
  localInfo: `<p>Check the local tides and weather at…</p>
    <ul>
    <li><a href="https://www.hko.gov.hk/en/index.html" target="_blank" rel="noopener">Hong Kong Observatory</a></li>
    <li><a href="https://current.hydro.gov.hk/en/map.html" target="_blank" rel="noopener">Hong Kong Tidal Stream Prediction System</a></li>
    <li><a href="https://data.gov.hk/en-data/dataset/hk-hko-rss-times-and-heights-of-high-and-low-tides"
            target="_blank" rel="noopener">Predicted tidal information in CSV format</a></li>
    </ul>
    <p>Look up local species information at…</p>
    <ul>
    <li><a href="https://www.marinespecies.org/hkrms/" target="_blank" rel="noopener">Hong Kong Register of Marine Species</a></li>
    </ul>
    <p>Check images of common species on Hong Kong rocky shores at…</p>
    <ul>
    <li><a href="${import.meta.env.BASE_URL}students/commonSpecies">Common species</a></li>
    </ul>
    <p>Extra reading…</p>
    <ul>
    <li>Brian Morton and John Morton (1983). <b>The sea shore ecology of Hong Kong</b>. Hong Kong University Press.</li>
    </ul>`,
};

export const acknowledgement = `<p><b>Virtual Rocky Shore Sampling Unit (VRSSU)</b> is developed by <i>Yi-Fei Gu</i>, <i>Tommy T. Y. Hui</i>, <i>Sarah L. Y. Lau</i>, <i>Simon C. M. Tse</i> and <i>Gray A. Williams</i>.</p>

    <h3>Development tools</h3>
    <ul>
    <li>Astro, Vue.js, and related open-source libraries are free software under the MIT license</li>
    <li>Highcharts is released under Creative Commons Attribution-NonCommercial 3.0, licensed for Educational Institution usage</li>
    <li>viewer.js is free software under the Apache License 2.0</li>
    </ul>
    <p><b>Photos and videos</b><br />
    <i>Simon C. M. Tse</i>, <i>Sarah L. Y. Lau</i>, <i>Jackson W. T. Lau</i>, <i>Gray A. Williams</i> and <i>Yi-Fei Gu</i></p>
    <p><b>Data collection</b><br />
    <a href="https://www.tidehku.com/" target="_blank" rel="noopener">TIDE group</a> and collaborators</p>
    <h3>Species identification guide</h3>
    <ul>
    <li>prepared by <i>Stephen Cartwright</i>, <i>Benny Chan</i>, <i>Richard Huang</i>, <i>Cecily Law</i>, <i>Alan Leung</i>, <i>Lily Ng</i>, <i>Terence Ng</i>, <i>Gray A. Williams</i> and <i>Cynthia Yau</i></li>
    <li>copyright belongs to Ecology &amp; Biodiversity, School of Biological Sciences, The University of Hong Kong</li>
    </ul>
    <p>The VRSSU team would like to acknowledge the User Guide of <a href="https://www.biosch.hku.hk/ecology/porcupine/por18/vsb.htm" target="_blank" rel="noopener"><b>Virtual School of BIODIVERSITY - Rocky Shore Sampling Unit</b></a> produced by the <i>FieldTripPro</i> in 2000.</p>
    `;

export const dashboard = {
  intro:
    'Use this field guide to connect rocky-shore ecology with a repeatable survey method, then test how sampling effort changes the story told by abundance data.',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      href: '/students/introStudent',
      stage: 'Frame the question',
      effort: '12–15 min',
      text: 'Start with the ecological question: how can a manageable set of quadrats represent a much larger shore?',
      objectives: [
        'Explain why rocky shores are useful natural laboratories.',
        'Recognise why representative, repeatable samples matter.',
      ],
      action: 'Start the introduction',
    },
    {
      id: 'before',
      title: 'Before you go',
      href: '/students/beforeUgo',
      stage: 'Prepare the survey',
      effort: '30–40 min',
      text: 'Read the shore, prepare safely, standardise the protocol, and practise recognising common species.',
      objectives: [
        'Connect tides and wave exposure to survey conditions.',
        'Plan a safe, repeatable transect-and-quadrat survey.',
      ],
      action: 'Open the field-prep guide',
    },
    {
      id: 'after',
      title: 'After you return',
      href: '/students/afterUreturn',
      stage: 'Interrogate the data',
      effort: '25–35 min',
      text: 'Move from field counts to mean, SD, and SE, then compare sample data with results from your own spreadsheet.',
      objectives: [
        'Describe how sampling effort affects an abundance estimate.',
        'Distinguish variation among quadrats from uncertainty in the mean.',
      ],
      action: 'Begin with the theory',
    },
    {
      id: 'resources',
      title: 'Resources',
      href: '/students/resources',
      stage: 'Keep the guide handy',
      effort: 'Use as needed',
      text: 'Find tide and weather tools, species references, practical software, and further reading.',
      objectives: [
        'Locate current planning and identification references.',
        'Extend the field guide for a local shore or class project.',
      ],
      action: 'Browse resources',
    },
  ],
};

export const afterTheory = {
  textPrefix:
    'After fieldwork you will move from field notes to a spreadsheet. What can you learn from these counts, and how do you know whether your data are representative of the shore?',
  p1: 'Descriptive statistics summarise abundance. Suppose four quadrats give counts 0, 5, 2, and 10.',
  p2: 'The mean abundance is (0 + 5 + 2 + 10) / 4 = 4.25 individuals per quadrat. The standard deviation (SD) describes how spread out the counts are around that mean.',
  p3: `Worked SD (population form used in VRSSU plots): differences from the mean are −4.25, 0.75, −2.25, and 5.75. Squared differences sum to 75.75. Variance = 75.75 / 4 = 18.9375, so SD = √18.9375 ≈ 4.35. We often report abundance as mean ± SD (e.g. 4.25 ± 4.35). <b>Note:</b> many textbooks use sample SD with divisor <i>n</i>−1; VRSSU keeps the legacy population formula (divisor <i>n</i>) so plots match earlier teaching materials.`,
  p4: 'The Standard Error of the Mean (SE = SD / √n) describes uncertainty in the mean estimate. As you add more quadrats, SE usually shrinks even if SD stays similar — which is why sampling effort matters.',
};
