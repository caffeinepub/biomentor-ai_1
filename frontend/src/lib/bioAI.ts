/**
 * Client-side AI biology tutor response logic.
 * All AI responses are generated client-side as per project constraints.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExamQuestion {
  question: string;
  answer: string;
  type: string;
  marks: number;
}

export interface NoteSet {
  detailed: string;
  revision: string;
  bullets: string;
  mechanisms: string;
  definitions: string;
}

export interface AdaptivePracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MentorshipContent {
  textbooks: string;
  studyStrategy: string;
  examPrep: string;
  careerGuidance: string;
}

// ─── Topics ───────────────────────────────────────────────────────────────────

const BIOLOGY_TOPICS = [
  'Cell Biology',
  'Genetics',
  'Molecular Biology',
  'Biochemistry',
  'Microbiology',
  'Immunology',
  'Ecology',
  'Evolution',
  'Physiology',
  'Biotechnology',
  'Neuroscience',
  'Developmental Biology',
];

export function getBiologyTopics(): string[] {
  return BIOLOGY_TOPICS;
}

// ─── Voice / Text Chat Response ───────────────────────────────────────────────

interface TopicResponse {
  keywords: string[];
  response: string;
}

const topicResponses: TopicResponse[] = [
  {
    keywords: ['cell', 'cells', 'cell structure', 'organelle', 'organelles', 'membrane', 'nucleus', 'mitochondria', 'chloroplast', 'ribosome', 'cytoplasm'],
    response: `Cells are the fundamental units of life. Every living organism is made of one or more cells.

The main parts of a eukaryotic cell include the nucleus, which is the control center containing DNA. The mitochondria are the powerhouses of the cell that produce ATP through cellular respiration. The cell membrane is a phospholipid bilayer that controls what enters and exits the cell. The endoplasmic reticulum is a network of membranes involved in protein and lipid synthesis. The Golgi apparatus processes and packages proteins for secretion. Ribosomes are the sites of protein synthesis.

Plant cells additionally have a cell wall for structural support, chloroplasts for photosynthesis, and a large central vacuole for storage.

Would you like to know more about any specific organelle?`,
  },
  {
    keywords: ['photosynthesis', 'light reaction', 'dark reaction', 'calvin cycle', 'chlorophyll', 'glucose', 'sunlight', 'carbon dioxide', 'co2'],
    response: `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored as glucose.

The overall equation is: 6CO2 plus 6H2O plus light energy produces C6H12O6 plus 6O2.

Photosynthesis occurs in two main stages. The Light-Dependent Reactions take place in the thylakoid membranes. Light energy is absorbed by chlorophyll and used to split water molecules, releasing oxygen as a byproduct. This stage produces ATP and NADPH.

The Calvin Cycle takes place in the stroma of the chloroplast. Carbon dioxide from the air is fixed into organic molecules using the ATP and NADPH from the light reactions. The end product is glucose.

Factors affecting photosynthesis include light intensity, carbon dioxide concentration, temperature, and water availability.`,
  },
  {
    keywords: ['respiration', 'cellular respiration', 'atp', 'glycolysis', 'krebs cycle', 'electron transport', 'aerobic', 'anaerobic', 'fermentation'],
    response: `Cellular respiration is the process by which cells break down glucose to release energy in the form of ATP.

The overall equation for aerobic respiration is: C6H12O6 plus 6O2 produces 6CO2 plus 6H2O plus ATP energy.

There are three main stages. Glycolysis occurs in the cytoplasm where one glucose molecule is split into two pyruvate molecules, producing a net gain of 2 ATP. The Krebs Cycle occurs in the mitochondrial matrix and produces CO2, ATP, NADH, and FADH2. The Electron Transport Chain occurs in the inner mitochondrial membrane and produces approximately 32 to 34 ATP molecules.

Anaerobic respiration occurs without oxygen and produces much less ATP. Examples include lactic acid fermentation in muscles and alcoholic fermentation in yeast.`,
  },
  {
    keywords: ['dna', 'rna', 'gene', 'genes', 'genetics', 'chromosome', 'chromosomes', 'nucleotide', 'base pair', 'double helix', 'replication', 'transcription', 'translation', 'protein synthesis'],
    response: `DNA, or deoxyribonucleic acid, is the molecule that carries genetic information in all living organisms.

DNA is a double helix made of two strands of nucleotides. Each nucleotide contains a deoxyribose sugar, a phosphate group, and one of four nitrogenous bases: adenine, thymine, guanine, or cytosine. Adenine pairs with thymine, and guanine pairs with cytosine.

DNA Replication: Before cell division, DNA is copied. The double helix unwinds, and each strand serves as a template for a new complementary strand.

Gene Expression involves two steps. Transcription occurs in the nucleus where DNA is used as a template to make messenger RNA. Translation occurs at ribosomes where the mRNA sequence is read to assemble a chain of amino acids into a protein.`,
  },
  {
    keywords: ['mitosis', 'meiosis', 'cell division', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis', 'interphase'],
    response: `Cell division is essential for growth, repair, and reproduction.

Mitosis produces two genetically identical daughter cells with the same number of chromosomes as the parent cell. It is used for growth and tissue repair. The stages are Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis.

Meiosis produces four genetically unique daughter cells with half the number of chromosomes. It is used to produce gametes, which are sperm and egg cells. Meiosis involves two rounds of division. Meiosis I separates homologous chromosome pairs. Meiosis II separates sister chromatids. Crossing over during meiosis I increases genetic diversity.`,
  },
  {
    keywords: ['evolution', 'natural selection', 'darwin', 'adaptation', 'species', 'variation', 'fitness', 'survival', 'descent'],
    response: `Evolution is the change in heritable characteristics of biological populations over successive generations.

Charles Darwin proposed the theory of evolution by natural selection, which has four key principles. First, variation: individuals in a population show variation in their traits. Second, inheritance: many variations are heritable. Third, selection: individuals with traits better suited to their environment survive and reproduce more successfully. Fourth, time: over many generations, favorable traits become more common.

Key concepts include adaptation, which is a trait that increases an organism's fitness. Speciation is the formation of new species when populations become reproductively isolated. Evidence for evolution comes from the fossil record, comparative anatomy, and molecular biology.`,
  },
  {
    keywords: ['ecosystem', 'ecology', 'food chain', 'food web', 'biome', 'habitat', 'population', 'community', 'biodiversity', 'producer', 'consumer', 'decomposer'],
    response: `Ecology is the study of how organisms interact with each other and their environment.

Energy flow in ecosystems: Producers, mainly plants, capture energy from sunlight through photosynthesis. Primary consumers are herbivores that eat plants. Secondary consumers are carnivores that eat herbivores. Decomposers break down dead organic matter and recycle nutrients.

Only about 10 percent of energy is transferred between trophic levels, which is why food chains are typically short.

Biodiversity refers to the variety of life in an area. High biodiversity generally makes ecosystems more stable and resilient.`,
  },
  {
    keywords: ['hormone', 'hormones', 'endocrine', 'insulin', 'adrenaline', 'testosterone', 'estrogen', 'thyroid', 'pituitary', 'gland'],
    response: `The endocrine system is a network of glands that produce and secrete hormones to regulate body functions.

Hormones are chemical messengers that travel through the bloodstream to target organs and cells. They regulate processes such as growth, metabolism, reproduction, and stress response.

Key endocrine glands include the pituitary gland, which controls other glands and produces growth hormone. The thyroid gland produces thyroxine to regulate metabolism. The pancreas produces insulin to lower blood glucose and glucagon to raise it. The adrenal glands produce adrenaline for the fight-or-flight response.

Hormonal regulation uses negative feedback loops to maintain homeostasis.`,
  },
  {
    keywords: ['nervous system', 'neuron', 'neurons', 'brain', 'spinal cord', 'nerve', 'synapse', 'action potential', 'reflex', 'neurotransmitter'],
    response: `The nervous system coordinates body activities by transmitting electrical and chemical signals.

The central nervous system consists of the brain and spinal cord. The peripheral nervous system consists of all nerves outside the brain and spinal cord.

Neurons are the basic units of the nervous system. A neuron has a cell body containing the nucleus, dendrites that receive signals, and an axon that transmits signals away from the cell body.

An action potential is an electrical signal that travels along the axon. At a synapse, the signal is transmitted chemically via neurotransmitters. Reflex arcs allow rapid responses without involving the brain.`,
  },
  {
    keywords: ['osmosis', 'diffusion', 'active transport', 'passive transport', 'concentration gradient', 'selectively permeable', 'tonicity', 'hypertonic', 'hypotonic', 'isotonic'],
    response: `Transport across cell membranes is essential for cells to obtain nutrients and remove waste.

Diffusion is the movement of molecules from high to low concentration. It requires no energy. Osmosis is the diffusion of water molecules across a selectively permeable membrane from low to high solute concentration.

In a hypotonic solution, water moves into the cell, which may cause it to swell. In a hypertonic solution, water moves out of the cell, causing it to shrink. In an isotonic solution, there is no net movement of water.

Active transport moves molecules against their concentration gradient and requires ATP. Facilitated diffusion uses protein channels to help molecules cross the membrane without energy.`,
  },
];

const generalResponses = [
  "That's a great biology question! Biology covers the study of all living things. Could you be more specific about which area you'd like to explore? I can help with cell biology, genetics, evolution, ecology, physiology, and much more.",
  "Excellent question! To give you the most helpful answer, could you tell me more about what specifically you'd like to know? I can explain topics like photosynthesis, cellular respiration, DNA and genetics, evolution, ecosystems, and more.",
  "I'd be happy to help with your biology question! What specific topic would you like to explore? Whether it's how cells work, how genes are inherited, or how ecosystems function, I'm here to help.",
  "Great question about biology! I can help you understand concepts from molecular biology all the way to ecology. What specific topic would you like to explore today?",
];

/**
 * Get a biology AI response for the given query.
 * Returns plain text suitable for both display and text-to-speech.
 */
export function getBioAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  let bestMatch: TopicResponse | null = null;
  let bestScore = 0;

  for (const topic of topicResponses) {
    let score = 0;
    for (const keyword of topic.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

/**
 * Legacy alias used by AITutor text chat.
 */
export function generateTutorResponse(question: string): string {
  return getBioAIResponse(question);
}

// ─── Notes Generator ──────────────────────────────────────────────────────────

export function generateNotes(topic: string, _additionalContent?: string): NoteSet {
  const t = topic.toLowerCase();

  const topicData = getTopicData(t);

  return {
    detailed: generateDetailedNotes(topic, topicData),
    revision: generateRevisionNotes(topic, topicData),
    bullets: generateBulletNotes(topic, topicData),
    mechanisms: generateMechanismNotes(topic, topicData),
    definitions: generateDefinitionNotes(topic, topicData),
  };
}

interface TopicData {
  overview: string;
  keyPoints: string[];
  mechanisms: string[];
  definitions: Record<string, string>;
  examTips: string[];
}

function getTopicData(topic: string): TopicData {
  if (topic.includes('cell') || topic.includes('organelle')) {
    return {
      overview: 'Cell biology is the study of cell structure, function, and behavior. Cells are the basic structural and functional units of all living organisms.',
      keyPoints: [
        'Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells have one',
        'The cell membrane is a fluid mosaic of phospholipids and proteins',
        'Mitochondria produce ATP via oxidative phosphorylation',
        'The nucleus contains DNA organized into chromosomes',
        'Ribosomes are the sites of protein synthesis',
        'The endomembrane system includes ER, Golgi, and vesicles',
        'Cytoskeleton provides structural support and enables movement',
      ],
      mechanisms: [
        'Fluid mosaic model: phospholipid bilayer with embedded proteins',
        'Endocytosis and exocytosis for bulk transport',
        'Signal transduction pathways for cell communication',
        'Cell cycle regulation by cyclins and CDKs',
      ],
      definitions: {
        'Organelle': 'A specialized subunit within a cell that has a specific function',
        'Plasma membrane': 'The phospholipid bilayer that encloses the cell',
        'Cytoplasm': 'The fluid-filled space inside the cell membrane, excluding the nucleus',
        'Nucleus': 'The membrane-bound organelle containing the cell\'s genetic material',
        'Mitochondria': 'Organelles that produce ATP through cellular respiration',
        'Ribosome': 'Molecular machines that synthesize proteins',
        'Endoplasmic reticulum': 'Network of membranes involved in protein and lipid synthesis',
      },
      examTips: [
        'Know the differences between prokaryotic and eukaryotic cells',
        'Be able to describe the function of each organelle',
        'Understand the fluid mosaic model of the cell membrane',
        'Know the stages of the cell cycle and their checkpoints',
      ],
    };
  }

  if (topic.includes('photosynthesis')) {
    return {
      overview: 'Photosynthesis is the process by which photoautotrophs convert light energy into chemical energy stored in glucose. It occurs in the chloroplasts of plant cells.',
      keyPoints: [
        'Overall equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
        'Light-dependent reactions occur in the thylakoid membranes',
        'Calvin cycle (light-independent reactions) occurs in the stroma',
        'Chlorophyll absorbs red and blue light most efficiently',
        'Photosystems I and II work together in the light reactions',
        'RuBisCO is the key enzyme in carbon fixation',
        'Three turns of the Calvin cycle produce one G3P molecule',
      ],
      mechanisms: [
        'Photolysis: 2H₂O → 4H⁺ + 4e⁻ + O₂ (in Photosystem II)',
        'Electron transport chain generates a proton gradient',
        'ATP synthase uses the proton gradient to produce ATP',
        'Carbon fixation: CO₂ + RuBP → 2 molecules of 3-PGA',
        'Reduction: 3-PGA → G3P using ATP and NADPH',
        'Regeneration: G3P → RuBP using ATP',
      ],
      definitions: {
        'Chlorophyll': 'The primary photosynthetic pigment that absorbs light energy',
        'Thylakoid': 'Flattened membrane sacs in the chloroplast where light reactions occur',
        'Stroma': 'The fluid-filled space of the chloroplast where the Calvin cycle occurs',
        'Photolysis': 'The splitting of water molecules using light energy',
        'Carbon fixation': 'The incorporation of CO₂ into organic molecules',
        'RuBisCO': 'The enzyme that catalyzes carbon fixation in the Calvin cycle',
        'G3P': 'Glyceraldehyde-3-phosphate, the direct product of the Calvin cycle',
      },
      examTips: [
        'Know the inputs and outputs of each stage',
        'Understand where each stage occurs in the chloroplast',
        'Be able to explain the role of each photosystem',
        'Know the factors that affect the rate of photosynthesis',
      ],
    };
  }

  if (topic.includes('genetics') || topic.includes('dna') || topic.includes('gene')) {
    return {
      overview: 'Genetics is the study of heredity and genetic variation. DNA carries genetic information that is passed from parents to offspring.',
      keyPoints: [
        'DNA is a double helix composed of nucleotides',
        'Base pairing: A-T and G-C in DNA; A-U and G-C in RNA',
        'DNA replication is semi-conservative',
        'Transcription produces mRNA from a DNA template',
        'Translation converts mRNA codons into amino acids',
        'Mutations are changes in the DNA sequence',
        'Mendel\'s laws govern inheritance of traits',
      ],
      mechanisms: [
        'DNA replication: helicase unwinds, primase adds primer, DNA polymerase extends',
        'Transcription: RNA polymerase reads template strand 3\'→5\', produces mRNA 5\'→3\'',
        'Translation: ribosome reads codons, tRNA brings amino acids, peptide bonds form',
        'Meiosis generates genetic diversity through crossing over and independent assortment',
      ],
      definitions: {
        'Gene': 'A segment of DNA that encodes a functional product, usually a protein',
        'Allele': 'An alternative form of a gene at a given locus',
        'Genotype': 'The genetic makeup of an organism',
        'Phenotype': 'The observable characteristics of an organism',
        'Dominant': 'An allele that is expressed when present in one or two copies',
        'Recessive': 'An allele that is only expressed when present in two copies',
        'Codon': 'A sequence of three nucleotides that codes for an amino acid',
      },
      examTips: [
        'Know the central dogma: DNA → RNA → Protein',
        'Be able to solve Punnett square problems',
        'Understand the difference between genotype and phenotype',
        'Know the types of mutations and their effects',
      ],
    };
  }

  if (topic.includes('evolution') || topic.includes('natural selection')) {
    return {
      overview: 'Evolution is the change in heritable characteristics of biological populations over successive generations, driven by mechanisms including natural selection, genetic drift, and gene flow.',
      keyPoints: [
        'Natural selection acts on heritable variation in populations',
        'Fitness is the reproductive success of an organism',
        'Genetic drift causes random changes in allele frequencies',
        'Gene flow transfers alleles between populations',
        'Speciation occurs when populations become reproductively isolated',
        'Molecular evidence supports common ancestry',
        'The fossil record documents evolutionary history',
      ],
      mechanisms: [
        'Natural selection: variation → differential survival → inheritance of favorable traits',
        'Allopatric speciation: geographic isolation leads to reproductive isolation',
        'Sympatric speciation: reproductive isolation without geographic separation',
        'Hardy-Weinberg equilibrium: allele frequencies remain constant without evolutionary forces',
      ],
      definitions: {
        'Evolution': 'Change in allele frequencies in a population over time',
        'Natural selection': 'The process by which organisms with favorable traits survive and reproduce more',
        'Fitness': 'The relative reproductive success of an individual',
        'Adaptation': 'A heritable trait that increases fitness in a given environment',
        'Speciation': 'The formation of new species from existing ones',
        'Genetic drift': 'Random changes in allele frequencies due to chance events',
        'Gene flow': 'The movement of alleles between populations through migration',
      },
      examTips: [
        'Understand the four conditions for natural selection',
        'Know the difference between microevolution and macroevolution',
        'Be able to apply Hardy-Weinberg equations',
        'Know the types of reproductive isolation',
      ],
    };
  }

  // Default generic topic data
  return {
    overview: `${topic} is an important area of biology that encompasses the study of fundamental biological processes and their underlying mechanisms.`,
    keyPoints: [
      `${topic} involves complex interactions at the molecular, cellular, and organismal levels`,
      'Understanding the structure-function relationship is central to this topic',
      'Experimental methods and model organisms have advanced our knowledge',
      'This topic has important applications in medicine and biotechnology',
      'Key regulatory mechanisms control the processes involved',
    ],
    mechanisms: [
      'Molecular interactions drive the fundamental processes',
      'Regulatory feedback loops maintain homeostasis',
      'Signal transduction pathways coordinate cellular responses',
      'Enzymatic reactions catalyze key biochemical steps',
    ],
    definitions: {
      'Homeostasis': 'The maintenance of a stable internal environment',
      'Metabolism': 'The sum of all chemical reactions in an organism',
      'Enzyme': 'A biological catalyst that speeds up chemical reactions',
      'Substrate': 'The molecule upon which an enzyme acts',
      'Product': 'The molecule produced by an enzymatic reaction',
    },
    examTips: [
      'Focus on understanding mechanisms, not just memorizing facts',
      'Draw diagrams to visualize complex processes',
      'Practice applying concepts to novel scenarios',
      'Review past exam questions for this topic',
    ],
  };
}

function generateDetailedNotes(topic: string, data: TopicData): string {
  return `# ${topic} — Detailed Study Notes

## Overview
${data.overview}

## Key Concepts
${data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Mechanisms & Processes
${data.mechanisms.map(m => `• ${m}`).join('\n')}

## Key Definitions
${Object.entries(data.definitions).map(([term, def]) => `**${term}:** ${def}`).join('\n')}

## Exam Tips
${data.examTips.map(t => `• ${t}`).join('\n')}`;
}

function generateRevisionNotes(topic: string, data: TopicData): string {
  return `# ${topic} — Quick Revision

## Must-Know Points
${data.keyPoints.map(p => `• ${p}`).join('\n')}

## Core Mechanisms (1-line summaries)
${data.mechanisms.map(m => `→ ${m}`).join('\n')}

## Exam Focus
${data.examTips.map(t => `✓ ${t}`).join('\n')}`;
}

function generateBulletNotes(topic: string, data: TopicData): string {
  return `# ${topic} — Bullet Summary

**Overview:** ${data.overview}

**Key Points:**
${data.keyPoints.map(p => `• ${p}`).join('\n')}

**Processes:**
${data.mechanisms.map(m => `• ${m}`).join('\n')}

**Remember:**
${data.examTips.map(t => `• ${t}`).join('\n')}`;
}

function generateMechanismNotes(topic: string, data: TopicData): string {
  return `# ${topic} — Mechanisms & Processes

## Step-by-Step Processes
${data.mechanisms.map((m, i) => `### Step ${i + 1}\n${m}`).join('\n\n')}

## Key Interactions
${data.keyPoints.filter((_, i) => i < 4).map(p => `• ${p}`).join('\n')}

## Regulatory Points
• Feedback mechanisms maintain homeostasis
• Enzyme activity is regulated by inhibitors and activators
• Gene expression is controlled at multiple levels`;
}

function generateDefinitionNotes(topic: string, data: TopicData): string {
  return `# ${topic} — Key Definitions & Terminology

${Object.entries(data.definitions)
    .map(([term, def]) => `## ${term}\n${def}`)
    .join('\n\n')}

## Context
${data.overview}`;
}

// ─── Exam Questions ───────────────────────────────────────────────────────────

export function generateExamQuestions(topic: string, type: string, count: number): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  for (let i = 0; i < count; i++) {
    questions.push(createExamQuestion(topic, type, i));
  }

  return questions;
}

function createExamQuestion(topic: string, type: string, index: number): ExamQuestion {
  const typeConfig: Record<string, { marks: number; label: string }> = {
    twoMark: { marks: 2, label: 'Short Answer' },
    fiveMark: { marks: 5, label: 'Medium Answer' },
    eightMark: { marks: 8, label: 'Long Answer' },
    tenMark: { marks: 10, label: 'Essay' },
    mcq: { marks: 1, label: 'MCQ' },
    assertionReason: { marks: 2, label: 'Assertion-Reason' },
    caseBased: { marks: 4, label: 'Case-Based' },
  };

  const config = typeConfig[type] || { marks: 2, label: 'Short Answer' };

  const questionSets: Record<string, { question: string; answer: string }[]> = {
    twoMark: [
      {
        question: `Define the term "${topic}" and state its biological significance.`,
        answer: `**Definition:** ${topic} refers to the fundamental biological processes and structures associated with this area of study.\n\n**Significance:**\n• Essential for maintaining cellular homeostasis\n• Plays a critical role in organism survival and reproduction\n• Forms the basis for understanding related biological phenomena`,
      },
      {
        question: `State two key differences between the main components involved in ${topic}.`,
        answer: `**Difference 1:** Structure — the components differ in their molecular composition and organization.\n\n**Difference 2:** Function — each component performs a distinct role in the overall process, contributing to the efficiency and specificity of ${topic}.`,
      },
      {
        question: `What is the role of enzymes in ${topic}? Give one example.`,
        answer: `**Role of enzymes:** Enzymes act as biological catalysts that lower the activation energy of reactions in ${topic}, increasing the rate of biochemical processes without being consumed.\n\n**Example:** Specific enzymes catalyze key steps, ensuring reactions proceed efficiently under physiological conditions.`,
      },
    ],
    fiveMark: [
      {
        question: `Describe the process of ${topic} with reference to the key stages involved. Include the role of relevant molecules.`,
        answer: `**Introduction:**\n${topic} is a fundamental biological process essential for life.\n\n**Stage 1: Initiation**\n• The process begins with specific molecular signals\n• Key molecules are activated or assembled\n\n**Stage 2: Progression**\n• Core reactions proceed in a regulated sequence\n• Energy is either consumed or produced\n• Intermediate molecules are formed\n\n**Stage 3: Completion**\n• Final products are generated\n• Regulatory mechanisms ensure accuracy\n• The system returns to its baseline state\n\n**Significance:** This process is essential for cellular function and organism survival.`,
      },
      {
        question: `Explain how ${topic} is regulated in living organisms. Why is regulation important?`,
        answer: `**Regulation of ${topic}:**\n\n**1. Molecular Level:**\n• Enzyme activity is controlled by inhibitors and activators\n• Allosteric regulation adjusts enzyme conformation\n\n**2. Cellular Level:**\n• Signal transduction pathways coordinate responses\n• Feedback loops maintain homeostasis\n\n**3. Organismal Level:**\n• Hormonal signals coordinate responses across tissues\n• Neural regulation provides rapid responses\n\n**Importance of Regulation:**\n• Prevents wasteful overproduction\n• Maintains cellular homeostasis\n• Allows adaptation to changing conditions\n• Prevents disease states caused by dysregulation`,
      },
    ],
    eightMark: [
      {
        question: `Give a detailed account of ${topic}, including its molecular basis, key processes, regulation, and biological significance.`,
        answer: `**Introduction:**\n${topic} is a critical biological process that underpins many aspects of life at the molecular, cellular, and organismal levels.\n\n**Molecular Basis:**\n• Specific macromolecules (proteins, nucleic acids, lipids) are involved\n• Molecular interactions drive the process\n• Structural features determine functional properties\n\n**Key Processes:**\n• Initiation: specific signals trigger the process\n• Elongation/Progression: core reactions proceed sequentially\n• Termination: the process concludes with product formation\n\n**Regulation:**\n• Positive and negative feedback mechanisms\n• Allosteric regulation of key enzymes\n• Gene expression control\n• Post-translational modifications\n\n**Biological Significance:**\n• Essential for growth and development\n• Critical for energy metabolism\n• Important in disease pathology when dysregulated\n• Basis for biotechnological applications\n\n**Conclusion:**\nUnderstanding ${topic} is fundamental to biology and has important implications for medicine and biotechnology.`,
      },
    ],
    tenMark: [
      {
        question: `Write a comprehensive essay on ${topic}. Your answer should cover the historical background, molecular mechanisms, regulation, and current applications in medicine or biotechnology.`,
        answer: `**Introduction:**\n${topic} represents one of the most important areas in modern biology. Since its initial discovery, our understanding has grown enormously through advances in molecular biology and biochemistry.\n\n**Historical Background:**\n• Early observations established the fundamental principles\n• Key experiments revealed the molecular mechanisms\n• Modern techniques have provided detailed structural insights\n\n**Molecular Mechanisms:**\n• The process involves specific macromolecular interactions\n• Enzymatic reactions proceed in a defined sequence\n• Energy transformations drive the process forward\n• Structural changes accompany functional transitions\n\n**Regulation:**\n• Multiple levels of regulation ensure precision\n• Feedback mechanisms maintain homeostasis\n• Environmental signals modulate the process\n• Dysregulation leads to disease states\n\n**Applications:**\n• Medical: understanding disease mechanisms and developing treatments\n• Biotechnology: engineering organisms for industrial applications\n• Diagnostics: using molecular markers for disease detection\n• Therapeutics: targeting key molecules for drug development\n\n**Current Research:**\n• Advanced imaging techniques reveal new structural details\n• Genomic approaches identify new regulatory elements\n• Systems biology integrates multiple levels of analysis\n\n**Conclusion:**\n${topic} remains an active area of research with significant implications for human health and biotechnology. A thorough understanding of its mechanisms is essential for any biologist.`,
      },
    ],
    mcq: [
      {
        question: `Which of the following best describes the primary function of ${topic}?\n\nA) To maintain cellular homeostasis through regulated molecular interactions\nB) To provide structural support to the organism\nC) To facilitate the transport of molecules across membranes\nD) To store genetic information for future generations`,
        answer: `**Correct Answer: A**\n\n**Explanation:** The primary function of ${topic} is to maintain cellular homeostasis through regulated molecular interactions. This involves precise control of biochemical reactions and signaling pathways.\n\n**Why other options are incorrect:**\n• B) Structural support is a secondary function\n• C) Membrane transport is a separate process\n• D) Genetic information storage is the function of DNA`,
      },
      {
        question: `In the context of ${topic}, which enzyme plays the most critical regulatory role?\n\nA) DNA polymerase\nB) The rate-limiting enzyme of the primary pathway\nC) ATP synthase\nD) RNA polymerase`,
        answer: `**Correct Answer: B**\n\n**Explanation:** The rate-limiting enzyme of the primary pathway is the most critical regulatory point in ${topic}. This enzyme controls the overall flux through the pathway and is subject to allosteric regulation.\n\n**Key concept:** Rate-limiting enzymes are common targets for metabolic regulation and drug development.`,
      },
    ],
    assertionReason: [
      {
        question: `**Assertion (A):** ${topic} is essential for the survival of all living organisms.\n\n**Reason (R):** The processes involved in ${topic} provide energy and molecular building blocks required for cellular functions.\n\nChoose the correct option:\nA) Both A and R are true, and R is the correct explanation of A\nB) Both A and R are true, but R is not the correct explanation of A\nC) A is true but R is false\nD) A is false but R is true`,
        answer: `**Correct Answer: A**\n\n**Explanation:** Both the Assertion and Reason are true, and the Reason correctly explains the Assertion.\n\n${topic} is indeed essential for survival because the processes involved provide the energy (ATP) and molecular building blocks (amino acids, nucleotides, lipids) that cells need to carry out all their functions, including growth, repair, and reproduction.`,
      },
    ],
    caseBased: [
      {
        question: `**Case Study:**\nA researcher is studying a patient with a genetic disorder that affects a key enzyme involved in ${topic}. The patient shows symptoms including metabolic dysfunction and cellular stress.\n\n**Questions:**\n1. How would a deficiency in this enzyme affect the process of ${topic}? (2 marks)\n2. Suggest two possible therapeutic approaches to treat this condition. (2 marks)`,
        answer: `**Answer 1: Effect of enzyme deficiency (2 marks)**\n• The rate of ${topic} would decrease significantly due to the loss of catalytic activity\n• Substrate would accumulate upstream of the deficient enzyme\n• Product deficiency would impair downstream cellular processes\n• Compensatory mechanisms might be activated but would be insufficient\n\n**Answer 2: Therapeutic approaches (2 marks)**\n\n**Approach 1 — Enzyme Replacement Therapy:**\n• Administer functional enzyme exogenously\n• Restores normal catalytic activity\n• Example: similar to enzyme replacement in lysosomal storage disorders\n\n**Approach 2 — Gene Therapy:**\n• Introduce a functional copy of the defective gene\n• Allows the patient's cells to produce the enzyme\n• Provides a potentially permanent solution`,
      },
    ],
  };

  const questionsForType = questionSets[type] || questionSets['twoMark'];
  const q = questionsForType[index % questionsForType.length];

  return {
    question: q.question,
    answer: q.answer,
    type: config.label,
    marks: config.marks,
  };
}

// ─── Adaptive Practice ────────────────────────────────────────────────────────

export function generateAdaptivePracticeQuestion(
  topic: string,
  difficulty: number
): AdaptivePracticeQuestion {
  const difficultyLabel = difficulty <= 2 ? 'basic' : difficulty <= 4 ? 'intermediate' : 'advanced';

  const questionBanks: Record<string, AdaptivePracticeQuestion[]> = {
    'Cell Biology': [
      {
        question: 'Which organelle is known as the "powerhouse of the cell"?',
        options: ['A) Nucleus', 'B) Mitochondria', 'C) Ribosome', 'D) Golgi apparatus'],
        correctAnswer: 'B',
        explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration, providing energy for cellular activities.',
      },
      {
        question: 'What is the primary function of the Golgi apparatus?',
        options: ['A) DNA replication', 'B) Protein synthesis', 'C) Processing and packaging proteins', 'D) Lipid breakdown'],
        correctAnswer: 'C',
        explanation: 'The Golgi apparatus processes, modifies, and packages proteins received from the endoplasmic reticulum, then directs them to their final destinations.',
      },
      {
        question: 'Which component of the cell membrane is responsible for its selective permeability?',
        options: ['A) Cholesterol only', 'B) Peripheral proteins', 'C) The phospholipid bilayer', 'D) Carbohydrate chains'],
        correctAnswer: 'C',
        explanation: 'The phospholipid bilayer creates a hydrophobic barrier that selectively allows certain molecules to pass through, giving the membrane its selective permeability.',
      },
      {
        question: 'During which phase of the cell cycle does DNA replication occur?',
        options: ['A) G1 phase', 'B) S phase', 'C) G2 phase', 'D) M phase'],
        correctAnswer: 'B',
        explanation: 'DNA replication occurs during the S (synthesis) phase of interphase. The entire genome is duplicated so each daughter cell receives a complete copy.',
      },
      {
        question: 'What distinguishes the rough endoplasmic reticulum from the smooth ER?',
        options: ['A) Location in the cell', 'B) Presence of ribosomes', 'C) Membrane composition', 'D) Size of the lumen'],
        correctAnswer: 'B',
        explanation: 'The rough ER has ribosomes attached to its surface, giving it a "rough" appearance. These ribosomes synthesize proteins destined for secretion or membrane insertion.',
      },
    ],
    'Genetics': [
      {
        question: 'In a monohybrid cross between two heterozygous individuals (Aa × Aa), what is the expected phenotypic ratio?',
        options: ['A) 1:1', 'B) 1:2:1', 'C) 3:1', 'D) 9:3:3:1'],
        correctAnswer: 'C',
        explanation: 'A cross of Aa × Aa produces genotypes AA:Aa:aa in a 1:2:1 ratio. Since A is dominant, both AA and Aa show the dominant phenotype, giving a 3:1 phenotypic ratio.',
      },
      {
        question: 'What is the term for the physical location of a gene on a chromosome?',
        options: ['A) Allele', 'B) Locus', 'C) Genotype', 'D) Phenotype'],
        correctAnswer: 'B',
        explanation: 'A locus (plural: loci) is the specific physical location of a gene on a chromosome. Different alleles of a gene occupy the same locus on homologous chromosomes.',
      },
      {
        question: 'Which type of mutation involves the insertion or deletion of nucleotides, shifting the reading frame?',
        options: ['A) Point mutation', 'B) Silent mutation', 'C) Frameshift mutation', 'D) Missense mutation'],
        correctAnswer: 'C',
        explanation: 'Frameshift mutations result from insertions or deletions of nucleotides that are not multiples of three, shifting the reading frame and altering all downstream codons.',
      },
    ],
    'Molecular Biology': [
      {
        question: 'Which enzyme is responsible for unwinding the DNA double helix during replication?',
        options: ['A) DNA polymerase', 'B) Ligase', 'C) Helicase', 'D) Primase'],
        correctAnswer: 'C',
        explanation: 'Helicase unwinds and separates the two strands of the DNA double helix by breaking the hydrogen bonds between base pairs, creating the replication fork.',
      },
      {
        question: 'What is the role of tRNA in translation?',
        options: ['A) Carries the genetic code', 'B) Forms the ribosome structure', 'C) Brings amino acids to the ribosome', 'D) Catalyzes peptide bond formation'],
        correctAnswer: 'C',
        explanation: 'Transfer RNA (tRNA) molecules carry specific amino acids to the ribosome. Each tRNA has an anticodon that base-pairs with the corresponding mRNA codon, ensuring the correct amino acid is added.',
      },
    ],
    'Ecology': [
      {
        question: 'What percentage of energy is typically transferred from one trophic level to the next?',
        options: ['A) 1%', 'B) 10%', 'C) 50%', 'D) 90%'],
        correctAnswer: 'B',
        explanation: 'The 10% rule states that approximately 10% of energy is transferred from one trophic level to the next. The remaining 90% is lost as heat through metabolic processes.',
      },
      {
        question: 'Which type of symbiosis benefits one organism while the other is neither helped nor harmed?',
        options: ['A) Mutualism', 'B) Parasitism', 'C) Commensalism', 'D) Competition'],
        correctAnswer: 'C',
        explanation: 'Commensalism is a relationship where one organism benefits and the other is unaffected. An example is barnacles living on whales — the barnacles benefit from transport while the whale is unaffected.',
      },
    ],
    'Evolution': [
      {
        question: 'Which of the following is NOT a condition required for Hardy-Weinberg equilibrium?',
        options: ['A) Large population size', 'B) Random mating', 'C) Natural selection', 'D) No gene flow'],
        correctAnswer: 'C',
        explanation: 'Hardy-Weinberg equilibrium requires the ABSENCE of natural selection (along with no mutation, random mating, large population, and no gene flow). Natural selection disrupts equilibrium by changing allele frequencies.',
      },
      {
        question: 'What term describes the evolution of similar traits in unrelated species due to similar environmental pressures?',
        options: ['A) Divergent evolution', 'B) Coevolution', 'C) Convergent evolution', 'D) Parallel evolution'],
        correctAnswer: 'C',
        explanation: 'Convergent evolution occurs when unrelated species independently evolve similar traits in response to similar environmental challenges. Example: wings in birds and bats.',
      },
    ],
  };

  // Find matching topic bank
  const matchingKey = Object.keys(questionBanks).find(key =>
    topic.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(topic.toLowerCase())
  );

  const bank = matchingKey ? questionBanks[matchingKey] : null;

  if (bank && bank.length > 0) {
    // Select question based on difficulty (higher difficulty = later questions in bank)
    const index = Math.min(Math.floor((difficulty - 1) * bank.length / 6), bank.length - 1);
    return bank[index];
  }

  // Generic fallback question
  return {
    question: `Which of the following statements about ${topic} is most accurate at the ${difficultyLabel} level?`,
    options: [
      `A) ${topic} primarily involves simple molecular interactions`,
      `B) ${topic} is regulated by multiple feedback mechanisms`,
      `C) ${topic} occurs only in prokaryotic organisms`,
      `D) ${topic} does not require energy input`,
    ],
    correctAnswer: 'B',
    explanation: `${topic} is indeed regulated by multiple feedback mechanisms. This is a fundamental principle in biology — complex processes require precise regulation to maintain homeostasis and respond to changing conditions.`,
  };
}

// ─── Mentorship Content ───────────────────────────────────────────────────────

export function getMentorshipContent(): MentorshipContent {
  return {
    textbooks: `# Recommended Textbooks for Biology & Life Sciences

## Core Textbooks

### Cell & Molecular Biology
**Molecular Biology of the Cell** — Alberts et al.
The gold standard for cell biology. Comprehensive coverage of cell structure, function, and molecular mechanisms. Essential for any serious biology student.

**Molecular Cell Biology** — Lodish et al.
Excellent integration of molecular and cell biology. Strong on biochemical mechanisms and experimental approaches.

### Genetics
**Genetics: From Genes to Genomes** — Hartwell et al.
Modern approach to genetics with excellent coverage of genomics and molecular genetics. Great problem sets.

**Molecular Genetics of Bacteria** — Snyder et al.
Essential for understanding prokaryotic genetics and molecular biology techniques.

### Biochemistry
**Biochemistry** — Stryer (Berg, Tymoczko & Stryer)
The classic biochemistry text. Exceptional illustrations and clear explanations of metabolic pathways.

**Harper's Illustrated Biochemistry**
Excellent for medical students and those focusing on clinical applications of biochemistry.

### Physiology
**Guyton and Hall Medical Physiology**
The definitive physiology textbook. Comprehensive and well-illustrated.

**Human Physiology** — Silverthorn
More accessible than Guyton, with excellent clinical correlations.

## Reference Books

**The Cell: A Molecular Approach** — Cooper & Hausman
Good supplementary text with clear explanations.

**Lehninger Principles of Biochemistry** — Nelson & Cox
Classic biochemistry reference with excellent coverage of metabolism.

## Online Resources
- **NCBI PubMed** — Access to primary research literature
- **Khan Academy Biology** — Free video explanations
- **iBiology** — Video lectures from leading researchers
- **Coursera/edX** — Online courses from top universities`,

    studyStrategy: `# Proven Study Strategies for Biology

## The Foundation: Active Learning

### 1. The Feynman Technique
Explain concepts in simple language as if teaching someone else. If you can't explain it simply, you don't understand it well enough.

**How to apply:**
- Choose a concept
- Explain it in plain language
- Identify gaps in your understanding
- Review and simplify further

### 2. Spaced Repetition
Review material at increasing intervals to maximize long-term retention.

**Schedule:**
- Day 1: Learn new material
- Day 2: First review
- Day 4: Second review
- Day 8: Third review
- Day 16: Fourth review

**Tools:** Anki flashcard software is excellent for biology terms and concepts.

### 3. Concept Mapping
Create visual diagrams showing relationships between concepts.

**Benefits:**
- Reveals connections between topics
- Identifies gaps in knowledge
- Aids long-term memory

### 4. Practice Problems
Biology is not just memorization — you must apply concepts.

**Strategy:**
- Attempt problems before looking at solutions
- Analyze your mistakes carefully
- Create your own questions

## Study Session Structure

### The Pomodoro Technique
- 25 minutes focused study
- 5 minute break
- After 4 sessions: 15-30 minute break

### Daily Review Routine
1. Review previous day's notes (10 min)
2. New material study (60-90 min)
3. Practice questions (30 min)
4. Summary notes (15 min)

## Memory Techniques

### Mnemonics for Biology
- **PMAT** for mitosis stages (Prophase, Metaphase, Anaphase, Telophase)
- **King Philip Came Over For Good Soup** for taxonomy (Kingdom, Phylum, Class, Order, Family, Genus, Species)

### Visualization
Draw diagrams from memory. Recreating figures without looking at the textbook is one of the most effective study techniques.`,

    examPrep: `# Exam Preparation Strategy

## 8-Week Exam Preparation Plan

### Weeks 1-2: Foundation Review
- Review all lecture notes and textbook chapters
- Create a master list of key terms and concepts
- Identify weak areas requiring extra attention
- Begin making summary sheets for each topic

### Weeks 3-4: Deep Study
- Focus on weak areas identified in Week 1-2
- Work through past exam papers
- Create detailed concept maps
- Form or join a study group

### Weeks 5-6: Practice & Application
- Complete at least 3 full past papers under timed conditions
- Review all mistakes thoroughly
- Focus on question technique and mark schemes
- Practice drawing and labeling diagrams

### Weeks 7-8: Consolidation
- Final review of all topics
- Focus on high-yield topics (frequently examined)
- Practice quick recall of key facts
- Ensure you can write structured answers

## Exam Technique

### Reading the Question
- Read carefully — identify command words (describe, explain, compare, evaluate)
- Note the marks available — this indicates expected answer length
- Plan your answer before writing

### Command Words
- **Define:** Give a precise meaning
- **Describe:** State what happens (no explanation needed)
- **Explain:** Give reasons/mechanisms
- **Compare:** State similarities AND differences
- **Evaluate:** Weigh evidence and reach a conclusion

### Answer Structure
For longer answers:
1. Introduction — state the main point
2. Explanation — provide mechanisms and evidence
3. Examples — use specific examples
4. Conclusion — summarize key points

## High-Yield Topics
Focus extra time on these frequently examined areas:
- Cell division (mitosis and meiosis)
- DNA replication and protein synthesis
- Photosynthesis and cellular respiration
- Genetics and inheritance patterns
- Enzyme kinetics
- Membrane transport`,

    careerGuidance: `# Career Pathways in Biology & Life Sciences

## Academic & Research Careers

### Research Scientist
**Path:** BSc Biology → MSc/PhD → Postdoctoral research → Independent researcher

**Skills needed:**
- Strong analytical and critical thinking
- Laboratory techniques (PCR, cell culture, microscopy, etc.)
- Data analysis and statistics
- Scientific writing and communication

**Areas of specialization:**
- Molecular biology and genetics
- Cell biology and biochemistry
- Neuroscience
- Ecology and conservation biology

### University Lecturer/Professor
**Path:** PhD → Postdoctoral positions → Lecturer → Senior Lecturer → Professor

**Requirements:**
- PhD in relevant field
- Strong publication record
- Teaching experience
- Grant writing ability

## Healthcare & Medicine

### Medicine (MBBS/MD)
Biology is the foundation for medical school. Strong performance in biology, chemistry, and physics is essential.

**Key areas:** Physiology, biochemistry, pharmacology, pathology

### Pharmacy (MPharm)
Combines biology and chemistry. Excellent career prospects in clinical and industrial settings.

### Biomedical Science
Direct application of biology to healthcare. Roles in hospital laboratories, research, and diagnostics.

## Industry Careers

### Biotechnology & Pharmaceuticals
**Roles:** Research scientist, process development, quality control, regulatory affairs

**Companies:** AstraZeneca, GSK, Pfizer, Novartis, Roche, and many biotech startups

### Agricultural Biotechnology
**Roles:** Plant scientist, crop improvement researcher, agronomist

**Focus areas:** GM crops, sustainable agriculture, food security

### Environmental Science
**Roles:** Environmental consultant, conservation biologist, ecologist

**Employers:** Government agencies, NGOs, consulting firms

## Emerging Fields

### Bioinformatics
Combines biology with computer science. Analyzing genomic and proteomic data.

**Skills needed:** Programming (Python, R), statistics, molecular biology knowledge

### Synthetic Biology
Designing and engineering biological systems for useful purposes.

### Personalized Medicine
Using genomic information to tailor medical treatments to individuals.

## Building Your Career

### During Your Degree
- Seek laboratory research experience (summer projects, placements)
- Join biology societies and attend seminars
- Develop transferable skills (communication, teamwork, data analysis)
- Consider a year in industry placement

### Networking
- Attend scientific conferences
- Connect with researchers on LinkedIn
- Join professional societies (Society of Biology, Biochemical Society)`,
  };
}
