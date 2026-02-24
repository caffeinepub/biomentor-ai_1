// Simulated AI responses for biology tutoring
// All AI responses are generated client-side as per project constraints

export type AIResponseMode = 'tutor' | 'notes' | 'exam' | 'mentorship' | 'adaptive';

const BIOLOGY_TOPICS = [
  'Cell Biology', 'Genetics', 'Molecular Biology', 'Biochemistry',
  'Microbiology', 'Immunology', 'Ecology', 'Evolution', 'Physiology',
  'Biotechnology', 'Neuroscience', 'Developmental Biology'
];

export function getBiologyTopics(): string[] {
  return BIOLOGY_TOPICS;
}

export function generateTutorResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('dna') || q.includes('replication')) {
    return `Excellent question! Let me walk you through DNA replication step by step, just as it happens inside your cells.

**The Big Picture**
DNA replication is the process by which a cell copies its entire genome before cell division. Think of it like photocopying a very important document — but this photocopier is extraordinarily precise!

**Step 1: Initiation**
The process begins at specific sequences called *origins of replication*. In prokaryotes, there's typically one origin; in eukaryotes, there are thousands. The enzyme **helicase** unwinds and separates the double helix, creating what we call a *replication fork*.

**Step 2: Priming**
Here's something fascinating — DNA polymerase cannot start from scratch. It needs a short RNA primer (laid down by **primase**) to begin synthesis. This is like needing a running start before you can sprint!

**Step 3: Elongation**
- **DNA Polymerase III** (in prokaryotes) adds nucleotides in the 5'→3' direction
- The *leading strand* is synthesized continuously
- The *lagging strand* is synthesized in fragments called **Okazaki fragments**

**Step 4: Termination & Proofreading**
DNA polymerase has a remarkable proofreading ability — it corrects ~99.9% of errors. The final error rate is about 1 in 10⁹ nucleotides!

**Why does this matter for exams?**
Key points to remember: semi-conservative replication, the role of each enzyme (helicase, primase, DNA pol, ligase), and the difference between leading vs lagging strand synthesis.

Does this make sense so far? Would you like me to go deeper into any particular step, or shall we discuss what happens when replication goes wrong?`;
  }

  if (q.includes('photosynthesis') || q.includes('chlorophyll') || q.includes('light reaction')) {
    return `Great topic! Photosynthesis is one of the most fundamental processes in biology. Let me break it down clearly.

**What is Photosynthesis?**
Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy (glucose). The overall equation:

**6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂**

**Two Major Stages:**

**Stage 1: Light-Dependent Reactions (in Thylakoid Membranes)**
- Chlorophyll absorbs light (mainly red and blue wavelengths)
- Water molecules are split (*photolysis*): 2H₂O → 4H⁺ + 4e⁻ + O₂
- This releases the oxygen we breathe!
- ATP and NADPH are produced — these are the "energy currency" for Stage 2
- Electron transport chain operates here (Photosystems I and II)

**Stage 2: Light-Independent Reactions / Calvin Cycle (in Stroma)**
- Uses ATP and NADPH from Stage 1
- CO₂ is "fixed" by the enzyme **RuBisCO** — the most abundant enzyme on Earth!
- Three turns of the cycle produce one G3P molecule
- G3P is used to build glucose and other organic molecules

**A Real-Life Analogy:**
Think of Stage 1 as charging a battery (making ATP/NADPH) and Stage 2 as using that battery to build furniture (glucose) from raw materials (CO₂).

**Exam Tip:** Always distinguish between where each stage occurs and what goes in vs. what comes out!

Shall I explain the electron transport chain in more detail, or would you like to explore C4 and CAM plants?`;
  }

  if (q.includes('mitosis') || q.includes('cell division') || q.includes('meiosis')) {
    return `Cell division is a cornerstone of biology — let me teach you this systematically!

**Mitosis vs. Meiosis — The Key Distinction**

| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| Purpose | Growth, repair | Sexual reproduction |
| Divisions | 1 | 2 |
| Daughter cells | 2 (diploid) | 4 (haploid) |
| Genetic variation | None | Yes (crossing over) |

**Stages of Mitosis (PMAT — easy to remember!):**

**P — Prophase**
- Chromatin condenses into visible chromosomes
- Nuclear envelope breaks down
- Spindle fibers form from centrosomes

**M — Metaphase**
- Chromosomes align at the *metaphase plate* (cell's equator)
- Spindle fibers attach to kinetochores
- This is the best stage to count chromosomes!

**A — Anaphase**
- Sister chromatids are pulled apart to opposite poles
- Cell elongates
- "Ana" = apart — the chromatids move apart!

**T — Telophase**
- Nuclear envelopes reform around each set of chromosomes
- Chromosomes decondense
- Cytokinesis begins (cytoplasm divides)

**Why is this biologically significant?**
Errors in mitosis can lead to aneuploidy (wrong chromosome number), which is linked to cancer. Understanding checkpoints (G1, S, G2, M) is crucial for understanding how cells prevent these errors.

Would you like me to explain the checkpoints in detail, or shall we move on to meiosis and how it generates genetic diversity?`;
  }

  if (q.includes('protein') || q.includes('translation') || q.includes('ribosome') || q.includes('mrna')) {
    return `Protein synthesis is one of the most elegant processes in molecular biology. Let me guide you through it!

**The Central Dogma:**
DNA → (Transcription) → mRNA → (Translation) → Protein

**Translation: Building Proteins**

**Where it happens:** Ribosomes (in cytoplasm or on rough ER)

**The Players:**
- **mRNA** — the message/blueprint
- **tRNA** — the adapter molecules carrying amino acids
- **Ribosomes** — the molecular machines (made of rRNA + proteins)
- **Amino acids** — the building blocks

**Three Stages of Translation:**

**1. Initiation**
- Small ribosomal subunit binds to mRNA at the 5' cap
- Scans for the start codon: **AUG** (codes for Methionine)
- Large subunit joins, forming the complete ribosome
- Three sites: A (aminoacyl), P (peptidyl), E (exit)

**2. Elongation**
- tRNA with matching anticodon enters the A site
- Peptide bond forms between amino acids (peptidyl transferase activity)
- Ribosome translocates 3 nucleotides (one codon) in 5'→3' direction
- This repeats thousands of times per second!

**3. Termination**
- Stop codons (UAA, UAG, UGA) are recognized by release factors
- Polypeptide chain is released
- Ribosome dissociates

**Exam Highlight:** The genetic code is *degenerate* (multiple codons for one amino acid) but *unambiguous* (one codon = one amino acid). This is a favorite exam question!

Any doubts about this process? I can also explain post-translational modifications if you're ready!`;
  }

  if (q.includes('enzyme') || q.includes('catalyst') || q.includes('active site')) {
    return `Enzymes are the workhorses of biochemistry — let me explain them in a way you'll never forget!

**What are Enzymes?**
Enzymes are biological catalysts — mostly proteins — that speed up chemical reactions without being consumed. They can increase reaction rates by factors of 10⁶ to 10¹²!

**How Enzymes Work:**

**The Lock and Key Model (Emil Fischer, 1894)**
- Enzyme has a specific *active site*
- Substrate fits perfectly like a key in a lock
- Simple but doesn't explain all enzyme behavior

**The Induced Fit Model (Daniel Koshland, 1958)**
- Active site is flexible, not rigid
- Enzyme *changes shape* when substrate binds
- More accurate — explains why enzymes are so specific

**Factors Affecting Enzyme Activity:**

1. **Temperature** — increases rate until *denaturation* occurs at high temps
   - Human enzymes: optimal ~37°C (body temperature — not a coincidence!)

2. **pH** — each enzyme has an optimal pH
   - Pepsin (stomach): pH 2 | Trypsin (intestine): pH 8

3. **Substrate Concentration** — increases rate until *Vmax* is reached (all active sites occupied)

4. **Inhibitors:**
   - *Competitive*: competes for active site (overcome by more substrate)
   - *Non-competitive*: binds elsewhere, changes shape of active site
   - *Irreversible*: permanently inactivates enzyme (e.g., nerve agents!)

**Km and Vmax (Michaelis-Menten Kinetics)**
- Km = substrate concentration at half Vmax
- Low Km = high affinity for substrate
- This is a common exam calculation topic!

Shall I work through a Michaelis-Menten problem with you, or explain allosteric regulation?`;
  }

  if (q.includes('immune') || q.includes('antibody') || q.includes('lymphocyte') || q.includes('antigen')) {
    return `The immune system is one of biology's most sophisticated defense networks. Let me break it down!

**Two Arms of Immunity:**

**1. Innate Immunity (Non-specific, Fast)**
- First line of defense: skin, mucus, stomach acid
- Second line: inflammation, fever, phagocytes
- Responds within minutes to hours
- No memory — same response every time
- Key cells: Neutrophils, Macrophages, NK cells, Dendritic cells

**2. Adaptive Immunity (Specific, Slower but Powerful)**
- Responds within days
- Highly specific to particular antigens
- Has *immunological memory* — basis of vaccines!
- Key cells: B lymphocytes and T lymphocytes

**The Adaptive Immune Response:**

**Humoral Immunity (B cells)**
- B cells recognize antigens and differentiate into *plasma cells*
- Plasma cells produce **antibodies** (immunoglobulins)
- Antibody structure: 2 heavy chains + 2 light chains, Y-shaped
- 5 classes: IgG, IgM, IgA, IgE, IgD

**Cell-Mediated Immunity (T cells)**
- **Helper T cells (CD4+)**: Coordinate the immune response, activate B cells and cytotoxic T cells
- **Cytotoxic T cells (CD8+)**: Kill infected cells directly
- **Regulatory T cells**: Prevent autoimmunity

**Memory Cells — Why Vaccines Work:**
After an infection, some B and T cells become *memory cells* that persist for years. On re-exposure, they respond rapidly and powerfully — this is *secondary immune response*.

**Exam Focus:** MHC molecules (Class I and II), clonal selection theory, and the difference between active vs. passive immunity are frequent exam topics!

Would you like me to explain how vaccines work in detail, or discuss autoimmune diseases?`;
  }

  // Generic biology response
  const responses = [
    `That's a wonderful question! Let me approach this like a biology professor would — systematically and with real understanding.

**Understanding the Core Concept**

In biology, every process has a *why* behind it. Before memorizing facts, let's understand the biological significance of what you're asking about.

**Key Principles to Remember:**
1. Structure determines function — always ask "why is it shaped this way?"
2. Evolution drives biological design — traits exist because they confer survival advantages
3. Homeostasis is the goal — living systems constantly work to maintain balance

**For Your Specific Question:**
The topic you've raised connects to fundamental biological mechanisms. Let me explain the key concepts:

- **Molecular level**: At the cellular and molecular scale, this involves specific proteins, enzymes, and signaling molecules working in concert
- **Cellular level**: Individual cells respond to and regulate these processes
- **Organism level**: The integrated response affects the whole organism's physiology

**Exam Strategy:**
When answering questions on this topic, always:
1. Define key terms first
2. Explain the mechanism step by step
3. Discuss biological significance
4. Mention what happens when the process fails

I want to make sure you truly understand this, not just memorize it. Can you tell me what specific aspect you'd like me to elaborate on? Or do you have a doubt about any part of the explanation?`,

    `Excellent! You're asking about something really important in biology. Let me explain this the way I'd teach it in a university lecture.

**Setting the Context**

Biology is all about understanding *how life works* at every level — from molecules to ecosystems. The question you've asked touches on a fundamental biological principle.

**The Mechanism Explained:**

Think of biological systems like a well-orchestrated symphony. Every component has a role, and they all work together in precise coordination.

**Step-by-Step Breakdown:**
1. **Trigger/Signal**: Something initiates the process (could be a hormone, environmental change, or cellular signal)
2. **Reception**: Specific receptors or molecules detect the signal
3. **Transduction**: The signal is converted and amplified through a cascade
4. **Response**: The cell or organism responds appropriately
5. **Regulation**: Feedback mechanisms ensure the response is appropriate

**Real-Life Analogy:**
Imagine a thermostat system in your home. The temperature sensor (receptor) detects cold, sends a signal to the heater (effector), which warms the room until the thermostat detects the right temperature and turns off. This is *negative feedback* — the same principle governs most biological regulatory systems!

**Why This Matters:**
Understanding this mechanism helps you:
- Predict what happens when components fail (disease states)
- Understand drug mechanisms
- Answer "what if" questions in exams

Do you want me to go deeper into any specific aspect? Remember, you can interrupt me anytime with doubts!`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export interface NoteSet {
  detailed: string;
  revision: string;
  bullets: string;
  mechanisms: string;
  definitions: string;
}

export function generateNotes(topic: string, content?: string): NoteSet {
  const subject = topic || 'Biology Topic';

  return {
    detailed: `# Detailed Notes: ${subject}

## Introduction
${subject} is a fundamental concept in biology that plays a critical role in understanding life processes. This topic is essential for university-level biology and appears frequently in examinations.

## Background and Context
The study of ${subject} emerged from decades of scientific research. Understanding this topic requires knowledge of basic cellular and molecular biology principles.

## Core Concepts

### 1. Definition and Overview
${subject} refers to the biological processes and mechanisms that govern specific life functions. At its core, it involves the interaction of molecules, cells, and physiological systems working in concert.

### 2. Molecular Mechanisms
At the molecular level, ${subject} involves:
- Specific proteins and enzymes that catalyze key reactions
- Signaling molecules that coordinate cellular responses
- Gene expression changes that adapt the organism to conditions
- Post-translational modifications that regulate protein activity

### 3. Cellular Processes
Within cells, ${subject} manifests through:
- Changes in membrane permeability and transport
- Cytoskeletal reorganization
- Organelle function and biogenesis
- Cell cycle regulation and checkpoints

### 4. Physiological Significance
At the organism level, ${subject} contributes to:
- Homeostatic regulation
- Adaptation to environmental changes
- Development and differentiation
- Disease prevention and response

## Regulatory Mechanisms
Biological systems employ multiple layers of regulation:
1. **Transcriptional regulation**: Gene expression is controlled by transcription factors
2. **Post-transcriptional regulation**: mRNA stability and translation efficiency
3. **Post-translational regulation**: Protein modifications (phosphorylation, ubiquitination)
4. **Feedback loops**: Negative and positive feedback maintain balance

## Clinical and Applied Relevance
Understanding ${subject} has important implications for:
- Medical treatments and drug development
- Biotechnology applications
- Agricultural improvements
- Environmental biology

## Summary
${subject} represents a complex but beautifully organized biological system. Mastery of this topic requires understanding the connections between molecular events and their physiological consequences.`,

    revision: `# Quick Revision: ${subject}

## Key Points to Remember

**What is it?**
${subject} — a critical biological process involving coordinated molecular and cellular events.

**Where does it occur?**
- Primarily in specific cells/tissues/organelles
- Can be systemic (affecting whole organism)

**When does it happen?**
- Triggered by specific signals or conditions
- Regulated by feedback mechanisms

**Why is it important?**
- Essential for homeostasis
- Critical for development and survival
- Dysregulation leads to disease

## Important Terms
- **Substrate**: The molecule acted upon
- **Enzyme/Catalyst**: Speeds up the reaction
- **Product**: The result of the reaction
- **Regulator**: Controls the process
- **Feedback**: Mechanism to maintain balance

## Key Equations/Processes
1. Signal → Reception → Transduction → Response
2. Gene → mRNA → Protein → Function
3. Stimulus → Homeostatic response → Balance restored

## Common Exam Mistakes to Avoid
- Don't confuse similar terms
- Always specify location (where in the cell/body)
- Include both structure AND function
- Mention regulation mechanisms`,

    bullets: `# Bullet Summary: ${subject}

## Core Facts
• ${subject} is a fundamental biological process
• Occurs at molecular, cellular, and organismal levels
• Regulated by multiple feedback mechanisms
• Essential for homeostasis and survival

## Molecular Level
• Involves specific proteins, enzymes, and signaling molecules
• Gene expression is tightly regulated
• Post-translational modifications fine-tune activity
• Molecular interactions are highly specific (lock-and-key)

## Cellular Level
• Cells respond to signals through receptor-mediated pathways
• Organelles play specialized roles
• Cell cycle checkpoints ensure accuracy
• Apoptosis removes damaged or unnecessary cells

## Organism Level
• Integrated physiological response
• Nervous and endocrine systems coordinate responses
• Immune system provides protection
• Homeostatic mechanisms maintain internal balance

## Clinical Significance
• Mutations can cause disease
• Understanding mechanisms enables drug development
• Biomarkers help in diagnosis
• Therapeutic targets identified from pathway analysis

## Exam Tips
• Know the sequence of events
• Understand cause and effect
• Be able to explain "what happens if X fails"
• Connect molecular events to physiological outcomes`,

    mechanisms: `# Mechanism Notes: ${subject}

## Primary Mechanism

### Step 1: Initiation/Trigger
**What happens:** A specific signal or stimulus initiates the process
**Why it happens:** The organism needs to respond to internal or external changes
**Key molecules involved:** Ligands, hormones, environmental factors

### Step 2: Signal Reception
**What happens:** Specific receptors recognize and bind the signal
**Why it happens:** Ensures specificity — only appropriate cells respond
**Key molecules involved:** Receptor proteins (membrane or intracellular)

### Step 3: Signal Transduction
**What happens:** The signal is converted and amplified inside the cell
**Why it happens:** Allows a small signal to produce a large response
**Key molecules involved:** Second messengers (cAMP, Ca²⁺, IP₃), kinases

### Step 4: Effector Response
**What happens:** Target molecules are activated or inhibited
**Why it happens:** Produces the appropriate biological response
**Key molecules involved:** Transcription factors, enzymes, structural proteins

### Step 5: Termination
**What happens:** The signal is turned off
**Why it happens:** Prevents over-response; restores baseline state
**Key molecules involved:** Phosphatases, degradation enzymes, inhibitors

## Regulatory Checkpoints
- **Positive feedback**: Amplifies the response (e.g., blood clotting)
- **Negative feedback**: Dampens the response (e.g., blood glucose regulation)
- **Feedforward**: Anticipatory regulation

## What Happens When the Mechanism Fails?
- Loss of function → deficiency disease
- Gain of function → overactivation (e.g., cancer)
- Dysregulation → autoimmune or metabolic disorders`,

    definitions: `# Key Definitions: ${subject}

## Essential Terms

**Homeostasis**
The ability of an organism to maintain a stable internal environment despite external changes. Involves negative feedback loops.

**Enzyme**
A biological catalyst (usually protein) that speeds up chemical reactions without being consumed. Has an active site specific to its substrate.

**Receptor**
A protein molecule that receives and responds to a chemical signal (ligand). Can be membrane-bound or intracellular.

**Signal Transduction**
The process by which a cell converts an extracellular signal into an intracellular response through a cascade of molecular events.

**Gene Expression**
The process by which information from a gene is used to synthesize a functional gene product (usually protein). Includes transcription and translation.

**Metabolism**
The sum of all chemical reactions occurring in a living organism. Includes catabolism (breakdown) and anabolism (synthesis).

**Substrate**
The specific molecule upon which an enzyme acts. Binds to the enzyme's active site.

**Allosteric Regulation**
Regulation of enzyme activity by binding of a molecule at a site other than the active site, causing a conformational change.

**Feedback Inhibition**
A regulatory mechanism where the end product of a pathway inhibits an earlier step, preventing overproduction.

**Transcription Factor**
A protein that binds to specific DNA sequences and controls the rate of transcription of genetic information.

**Post-translational Modification**
Chemical modifications to a protein after translation (e.g., phosphorylation, glycosylation) that alter its function or location.

**Apoptosis**
Programmed cell death — an orderly process of cellular self-destruction that is essential for development and tissue homeostasis.`
  };
}

export interface ExamQuestion {
  question: string;
  type: string;
  marks: number;
  answer: string;
}

export function generateExamQuestions(
  topic: string,
  questionType: string,
  count: number = 3
): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  const typeConfig: Record<string, { marks: number; label: string }> = {
    twoMark: { marks: 2, label: '2-Mark' },
    fiveMark: { marks: 5, label: '5-Mark' },
    eightMark: { marks: 8, label: '8-Mark' },
    tenMark: { marks: 10, label: '10-Mark' },
    mcq: { marks: 1, label: 'MCQ' },
    assertionReason: { marks: 2, label: 'Assertion-Reason' },
    caseBased: { marks: 5, label: 'Case-Based' },
  };

  const config = typeConfig[questionType] || { marks: 5, label: '5-Mark' };

  if (questionType === 'mcq') {
    questions.push({
      question: `Which of the following best describes the role of ${topic} in cellular biology?\n\n(A) It primarily functions in energy production\n(B) It regulates gene expression and cellular homeostasis\n(C) It is only involved in cell division\n(D) It has no role in metabolic processes`,
      type: 'MCQ',
      marks: 1,
      answer: `**Correct Answer: (B)**\n\n**Explanation:** ${topic} plays a central role in regulating gene expression and maintaining cellular homeostasis. While it may interact with energy production pathways, its primary function is regulatory. Options A, C, and D are incorrect because they represent incomplete or inaccurate descriptions of the process.`
    });
    questions.push({
      question: `The enzyme responsible for the key step in ${topic} is:\n\n(A) DNA Polymerase\n(B) RNA Polymerase\n(C) The specific enzyme for this pathway\n(D) Lipase`,
      type: 'MCQ',
      marks: 1,
      answer: `**Correct Answer: (C)**\n\n**Explanation:** Each biological pathway has specific enzymes that catalyze key reactions. In the context of ${topic}, the pathway-specific enzyme is responsible for the rate-limiting step. Understanding enzyme specificity is crucial for understanding biological regulation.`
    });
    questions.push({
      question: `Which organelle is primarily associated with ${topic}?\n\n(A) Mitochondria\n(B) Nucleus\n(C) The organelle specific to this process\n(D) Lysosome`,
      type: 'MCQ',
      marks: 1,
      answer: `**Correct Answer: (C)**\n\n**Explanation:** Biological processes are compartmentalized within specific organelles. ${topic} occurs in the organelle that provides the appropriate environment (pH, enzymes, substrates) for the process to occur efficiently.`
    });
  } else if (questionType === 'assertionReason') {
    questions.push({
      question: `**Assertion (A):** ${topic} is essential for maintaining cellular homeostasis.\n\n**Reason (R):** Disruption of ${topic} leads to cellular dysfunction and disease.\n\n(A) Both A and R are true, and R is the correct explanation of A\n(B) Both A and R are true, but R is not the correct explanation of A\n(C) A is true, but R is false\n(D) A is false, but R is true`,
      type: 'Assertion-Reason',
      marks: 2,
      answer: `**Correct Answer: (A)**\n\n**Explanation:** Both the assertion and reason are correct. ${topic} is indeed essential for cellular homeostasis, and the reason correctly explains this — when the process is disrupted, cells cannot maintain their normal functions, leading to dysfunction and potentially disease states. The reason directly explains why the assertion is true.`
    });
  } else if (questionType === 'caseBased') {
    questions.push({
      question: `**Case Study:**\nA 25-year-old biology student is studying a patient with a genetic mutation affecting a key enzyme in the ${topic} pathway. The patient shows symptoms of metabolic dysfunction, fatigue, and cellular stress markers in blood tests.\n\n**Questions:**\n1. Explain the normal function of the affected pathway. (2 marks)\n2. How would the enzyme mutation affect the pathway? (2 marks)\n3. Suggest why the patient experiences fatigue. (1 mark)`,
      type: 'Case-Based',
      marks: 5,
      answer: `**Model Answer:**\n\n**1. Normal Function (2 marks):**\nThe ${topic} pathway normally functions to maintain cellular energy balance and metabolic homeostasis. The key enzyme catalyzes the rate-limiting step, converting substrate to product in a regulated manner. This process is essential for normal cellular function.\n\n**2. Effect of Mutation (2 marks):**\nThe enzyme mutation would reduce or eliminate catalytic activity, causing substrate accumulation and product deficiency. This creates a metabolic block, disrupting downstream processes. Compensatory mechanisms may be activated but are often insufficient to restore normal function.\n\n**3. Fatigue Explanation (1 mark):**\nFatigue results from impaired energy metabolism — cells cannot efficiently produce ATP, leading to reduced energy availability for muscle contraction and normal physiological functions.`
    });
  } else if (questionType === 'twoMark') {
    for (let i = 0; i < count; i++) {
      questions.push({
        question: i === 0
          ? `Define ${topic} and state its biological significance.`
          : i === 1
          ? `What is the role of enzymes in ${topic}? Name one key enzyme involved.`
          : `Distinguish between the two main types/phases of ${topic}.`,
        type: '2-Mark',
        marks: 2,
        answer: i === 0
          ? `**Definition (1 mark):** ${topic} is the biological process by which cells/organisms perform specific functions to maintain life and homeostasis.\n\n**Significance (1 mark):** It is essential for cellular survival, energy production, and maintaining the internal environment of the organism. Disruption leads to disease states.`
          : i === 1
          ? `**Role of enzymes (1 mark):** Enzymes act as biological catalysts, lowering the activation energy required for reactions in ${topic} to proceed efficiently.\n\n**Key enzyme (1 mark):** The primary enzyme involved is specific to the pathway and catalyzes the rate-limiting step, ensuring the process is regulated and responsive to cellular needs.`
          : `**Type/Phase 1 (1 mark):** The first component involves initiation and signal reception, where specific molecules trigger the process.\n\n**Type/Phase 2 (1 mark):** The second component involves the effector response and termination, where the biological outcome is achieved and the process is regulated back to baseline.`
      });
    }
  } else {
    // 5, 8, 10 mark questions
    questions.push({
      question: `Describe the mechanism of ${topic} with special reference to the molecular events involved. Include a discussion of regulatory mechanisms and the consequences of dysregulation.`,
      type: config.label,
      marks: config.marks,
      answer: `**Introduction (${Math.floor(config.marks * 0.1)} mark):**\n${topic} is a fundamental biological process that plays a critical role in maintaining cellular homeostasis and organismal function.\n\n**Main Body:**\n\n**Molecular Mechanism (${Math.floor(config.marks * 0.4)} marks):**\n1. **Initiation:** The process begins when a specific signal molecule binds to its receptor, triggering a conformational change\n2. **Signal Transduction:** Second messengers (cAMP, Ca²⁺) amplify the signal through kinase cascades\n3. **Effector Activation:** Target proteins are phosphorylated/activated, producing the biological response\n4. **Gene Expression Changes:** Transcription factors are activated, altering gene expression patterns\n\n**Regulatory Mechanisms (${Math.floor(config.marks * 0.3)} marks):**\n- **Negative feedback:** End products inhibit upstream enzymes, preventing overproduction\n- **Allosteric regulation:** Effector molecules bind to regulatory sites, modulating enzyme activity\n- **Covalent modification:** Phosphorylation/dephosphorylation cycles provide rapid, reversible control\n- **Transcriptional regulation:** Long-term adaptation through changes in gene expression\n\n**Consequences of Dysregulation (${Math.floor(config.marks * 0.2)} marks):**\n- Loss of function mutations → deficiency diseases\n- Gain of function mutations → overactivation (cancer, metabolic disorders)\n- Environmental disruption → toxicity and cellular stress\n\n**Conclusion (${Math.floor(config.marks * 0.1)} mark):**\nUnderstanding ${topic} is essential for developing therapeutic strategies for related diseases and advancing our knowledge of fundamental biology.`
    });

    if (config.marks >= 8) {
      questions.push({
        question: `With the help of a diagram (described in text), explain the step-by-step process of ${topic}. Highlight the key enzymes, substrates, and products at each stage. Discuss the clinical significance of this process.`,
        type: config.label,
        marks: config.marks,
        answer: `**Introduction:**\n${topic} represents one of the most important processes in biology, connecting molecular events to physiological outcomes.\n\n**Diagram Description:**\n[Signal/Stimulus] → [Receptor Binding] → [Signal Transduction Cascade] → [Effector Response] → [Biological Outcome] → [Feedback Regulation]\n\n**Step-by-Step Process:**\n\n**Step 1 — Signal Reception:**\n• Ligand binds to specific receptor (Kd = 10⁻⁹ to 10⁻¹² M)\n• Conformational change in receptor\n• G-protein activation (if GPCR pathway)\n\n**Step 2 — Second Messenger Generation:**\n• Adenylyl cyclase activated → cAMP produced\n• Phospholipase C activated → IP₃ + DAG\n• Ca²⁺ released from ER\n\n**Step 3 — Kinase Cascade:**\n• PKA/PKC activated by second messengers\n• Substrate proteins phosphorylated\n• Amplification: 1 signal → millions of responses\n\n**Step 4 — Nuclear Response:**\n• Transcription factors activated (e.g., CREB, NF-κB)\n• Gene expression altered\n• New proteins synthesized\n\n**Step 5 — Termination:**\n• Phosphodiesterase degrades cAMP\n• Phosphatases remove phosphate groups\n• Receptor internalization (desensitization)\n\n**Clinical Significance:**\n• Diabetes: Insulin signaling defects\n• Cancer: Constitutively active kinases (e.g., BCR-ABL)\n• Cardiovascular disease: Adrenergic signaling dysregulation\n• Drug targets: Kinase inhibitors (imatinib, erlotinib)\n\n**Conclusion:**\nThe precise regulation of ${topic} is critical for health, and understanding its mechanisms has led to numerous therapeutic breakthroughs.`
      });
    }
  }

  return questions;
}

export interface MentorshipContent {
  textbooks: string;
  studyStrategy: string;
  examPrep: string;
  careerGuidance: string;
}

export function getMentorshipContent(): MentorshipContent {
  return {
    textbooks: `# Recommended Textbooks for Biology & Life Sciences

## Core Undergraduate Textbooks

### Cell & Molecular Biology
**1. Molecular Biology of the Cell — Alberts et al.**
- The gold standard for cell biology
- Comprehensive coverage with excellent diagrams
- Best for: Deep conceptual understanding
- Level: Undergraduate to Graduate

**2. Molecular Cell Biology — Lodish et al.**
- Strong emphasis on molecular mechanisms
- Excellent clinical connections
- Best for: Exam preparation and mechanisms
- Level: Undergraduate

**3. Cell and Molecular Biology — Karp**
- Clear explanations with good illustrations
- Excellent for beginners
- Best for: First-year students
- Level: Introductory to Intermediate

### Biochemistry
**4. Lehninger Principles of Biochemistry — Nelson & Cox**
- The definitive biochemistry textbook
- Excellent metabolic pathway coverage
- Best for: Biochemistry courses
- Level: Undergraduate

**5. Biochemistry — Stryer (Berg, Tymoczko, Stryer)**
- Beautiful illustrations and clear explanations
- Strong on enzyme mechanisms
- Best for: Visual learners
- Level: Undergraduate

### Genetics & Genomics
**6. Molecular Biology of the Gene — Watson et al.**
- Written by the co-discoverer of DNA structure
- Authoritative and comprehensive
- Best for: Genetics and molecular biology
- Level: Undergraduate to Graduate

**7. Genetics: From Genes to Genomes — Hartwell et al.**
- Modern approach including genomics
- Excellent problem sets
- Best for: Genetics courses
- Level: Undergraduate

### Microbiology & Immunology
**8. Brock Biology of Microorganisms — Madigan et al.**
- Comprehensive microbiology coverage
- Excellent for medical microbiology
- Level: Undergraduate

**9. Janeway's Immunobiology — Murphy & Weaver**
- The standard immunology textbook
- Excellent diagrams of immune pathways
- Level: Undergraduate to Graduate

## Online Resources
- **NCBI PubMed**: Free access to research papers
- **Khan Academy Biology**: Free video explanations
- **iBiology**: Free lectures from leading researchers
- **Coursera/edX**: Online courses from top universities
- **Nature Education (Scitable)**: Free biology learning platform`,

    studyStrategy: `# Effective Study Strategies for Biology

## The Foundation: Active Learning

### 1. The Feynman Technique
**How to use it:**
1. Choose a concept (e.g., DNA replication)
2. Explain it as if teaching a 12-year-old
3. Identify gaps in your explanation
4. Go back to the source material
5. Simplify and use analogies

**Why it works:** Forces you to truly understand, not just memorize

### 2. Spaced Repetition
**The Science:** Memory consolidates during sleep and with repeated exposure
**Implementation:**
- Review new material after 1 day, 3 days, 1 week, 2 weeks, 1 month
- Use flashcard apps (Anki) with spaced repetition algorithms
- Don't cram — distribute study sessions

### 3. Concept Mapping
**How to create effective concept maps:**
1. Start with the central concept
2. Branch out to related concepts
3. Draw connections and label relationships
4. Use different colors for different categories
5. Include examples at the periphery

### 4. The SQ3R Method
- **S**urvey: Skim headings and figures first
- **Q**uestion: Turn headings into questions
- **R**ead: Read actively, seeking answers
- **R**ecite: Close book and recall key points
- **R**eview: Check your recall against the text

## Weekly Study Schedule Template

| Day | Activity | Duration |
|-----|----------|----------|
| Monday | New material + concept mapping | 2-3 hours |
| Tuesday | Practice questions on Monday's topic | 1-2 hours |
| Wednesday | New material + diagrams | 2-3 hours |
| Thursday | Review Monday + Wednesday | 1-2 hours |
| Friday | New material + past papers | 2-3 hours |
| Saturday | Comprehensive review + weak topics | 3-4 hours |
| Sunday | Light review + rest | 1 hour |

## Biology-Specific Tips

### For Mechanisms and Pathways
- Draw them from memory repeatedly
- Use color coding (substrates = blue, enzymes = red, products = green)
- Create "what if" scenarios (what if enzyme X is inhibited?)
- Connect pathways to each other

### For Definitions
- Don't just memorize — understand the etymology
- Create your own examples
- Use the term in sentences
- Connect to real-world applications

### For Diagrams
- Practice drawing from memory
- Label every component
- Add arrows showing direction/flow
- Include regulatory points`,

    examPrep: `# Exam Preparation Guide for Biology

## 6-Week Exam Preparation Plan

### Week 1-2: Foundation Review
**Goals:**
- Review all lecture notes and textbook chapters
- Create comprehensive concept maps for each topic
- Identify weak areas

**Daily Tasks:**
- 3-4 hours of focused study
- Create summary sheets for each topic
- List all key terms and definitions

### Week 3-4: Deep Practice
**Goals:**
- Work through past exam papers
- Practice drawing mechanisms from memory
- Focus on weak areas identified in Week 1-2

**Daily Tasks:**
- 2 hours of past paper practice
- 1 hour of weak topic review
- 1 hour of new practice questions

### Week 5: Intensive Revision
**Goals:**
- Timed practice under exam conditions
- Review all concept maps and summaries
- Clarify remaining doubts

**Daily Tasks:**
- Full mock exam (timed)
- Review mistakes immediately
- Consolidate notes

### Week 6: Final Preparation
**Goals:**
- Light review of key concepts
- Mental preparation
- Rest and sleep optimization

## Answering Exam Questions

### For 2-Mark Questions
- Define the term precisely (1 mark)
- Give one example or significance (1 mark)
- Be concise — 2-3 sentences maximum

### For 5-Mark Questions
Structure: Introduction (0.5) + 3 main points (1 mark each) + Conclusion (0.5)
- Use subheadings
- Include diagrams where relevant
- Connect points logically

### For 8-10 Mark Questions
Structure: Introduction (1) + Mechanism/Process (4-5) + Regulation (2) + Clinical significance (1) + Conclusion (1)
- Use numbered steps for mechanisms
- Include labeled diagrams
- Discuss "what happens when it fails"
- Use technical terminology correctly

### For MCQs
- Read all options before choosing
- Eliminate obviously wrong answers
- Watch for "always," "never," "only" — usually wrong
- If unsure, go with your first instinct

## Common Exam Mistakes to Avoid
1. ❌ Writing vague definitions — be precise
2. ❌ Forgetting to mention location (where in the cell?)
3. ❌ Ignoring regulation — always discuss control mechanisms
4. ❌ Not connecting molecular to physiological level
5. ❌ Skipping diagrams — they earn marks!
6. ❌ Running out of time — practice time management`,

    careerGuidance: `# Career Guidance in Biology & Life Sciences

## Career Pathways Overview

### 1. Research & Academia
**Roles:** Research Scientist, Professor, Postdoctoral Researcher
**Path:** BSc → MSc/PhD → Postdoc → Faculty/Industry Research
**Skills needed:** Critical thinking, grant writing, data analysis, publication
**Top institutions:** IISc, TIFR, NCBS, IITs, JNU (India); MIT, Harvard, Stanford (International)

### 2. Medical & Clinical Sciences
**Roles:** Physician, Clinical Researcher, Medical Scientist
**Path:** BSc Biology → MBBS/MD or MSc + PhD
**Skills needed:** Patient care, clinical research, diagnostic skills
**Opportunities:** Hospitals, research hospitals, clinical trials

### 3. Biotechnology & Pharmaceuticals
**Roles:** Research Scientist, Process Development, Quality Control, Regulatory Affairs
**Path:** BSc/MSc Biotechnology → Industry or PhD
**Top companies:** Biocon, Dr. Reddy's, Cipla, Pfizer, Novartis, Roche
**Skills needed:** Lab techniques (PCR, cell culture, ELISA), GMP, regulatory knowledge

### 4. Genomics & Bioinformatics
**Roles:** Bioinformatician, Genomics Analyst, Data Scientist
**Path:** BSc Biology + Programming skills → MSc Bioinformatics
**Skills needed:** Python/R programming, statistics, genomics tools (BLAST, Galaxy)
**Growing field:** Personalized medicine, precision oncology

### 5. Environmental & Conservation Biology
**Roles:** Ecologist, Conservation Scientist, Environmental Consultant
**Path:** BSc Ecology/Biology → MSc/PhD
**Organizations:** WWF, Wildlife Institute of India, IUCN

## Higher Studies Guidance

### For MSc/PhD in India
**Top Entrance Exams:**
- **CSIR-NET/JRF**: For PhD fellowships and lectureship
- **GATE (Life Sciences)**: For PSU jobs and some PhD programs
- **DBT-JRF**: For biotechnology PhD programs
- **ICMR-JRF**: For biomedical research
- **JAM**: For IIT MSc programs

**Preparation Tips:**
- Start 6-12 months before exam
- Focus on NCERT + standard textbooks
- Practice previous year papers
- Join coaching or online courses if needed

### For International Studies
**Key Tests:**
- **GRE**: Required for US PhD programs
- **TOEFL/IELTS**: English proficiency
- **MCAT**: For medical school (US)

**Funding Opportunities:**
- Fulbright Scholarship (US)
- DAAD (Germany)
- Commonwealth Scholarship (UK)
- Erasmus+ (Europe)
- MEXT (Japan)

## Skills to Develop Now
1. **Laboratory skills**: PCR, gel electrophoresis, cell culture, microscopy
2. **Data analysis**: Excel, R, Python basics
3. **Scientific writing**: Practice writing reports and summaries
4. **Presentation skills**: Present your work clearly
5. **Networking**: Attend seminars, join biology clubs
6. **Research experience**: Seek internships in labs

## Salary Expectations (India, 2024)
- Research Scientist (Entry): ₹4-8 LPA
- Pharma Industry (Entry): ₹3-6 LPA
- Bioinformatics: ₹5-12 LPA
- After PhD + Postdoc: ₹8-20 LPA
- Senior Researcher/Professor: ₹15-40 LPA`
  };
}

export function generateAdaptivePracticeQuestion(topic: string, difficulty: number): {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
} {
  const difficultyLabel = difficulty <= 2 ? 'Basic' : difficulty <= 4 ? 'Intermediate' : 'Advanced';

  if (difficulty <= 2) {
    return {
      question: `[${difficultyLabel}] What is the primary function of ${topic} in living organisms?`,
      options: [
        'A) Energy storage only',
        'B) Maintaining cellular homeostasis and enabling life processes',
        'C) Structural support only',
        'D) Signal transmission only'
      ],
      correctAnswer: 'B',
      explanation: `${topic} primarily functions to maintain cellular homeostasis and enable essential life processes. While it may contribute to energy storage, structural support, or signaling, its primary role is in maintaining the overall balance and function of living systems.`
    };
  } else if (difficulty <= 4) {
    return {
      question: `[${difficultyLabel}] Which regulatory mechanism primarily controls ${topic} in response to cellular energy status?`,
      options: [
        'A) Transcriptional activation only',
        'B) Allosteric regulation by AMP/ATP ratio',
        'C) Post-translational modification only',
        'D) Receptor-mediated endocytosis'
      ],
      correctAnswer: 'B',
      explanation: `${topic} is primarily regulated by allosteric mechanisms that sense the cellular energy status (AMP/ATP ratio). When energy is low (high AMP), the process is activated; when energy is abundant (high ATP), it is inhibited. This ensures efficient energy utilization.`
    };
  } else {
    return {
      question: `[${difficultyLabel}] A researcher observes that inhibiting the key enzyme in ${topic} leads to paradoxical activation of downstream targets. Which mechanism best explains this observation?`,
      options: [
        'A) Substrate accumulation activating alternative pathways',
        'B) Compensatory upregulation of parallel pathways',
        'C) Feedback loop disruption causing loss of inhibitory control',
        'D) All of the above could contribute'
      ],
      correctAnswer: 'D',
      explanation: `This complex observation can be explained by multiple mechanisms: (A) substrate accumulation can activate alternative metabolic routes; (B) cells compensate by upregulating parallel pathways; (C) disrupting the feedback loop removes inhibitory signals on downstream targets. In biological systems, these mechanisms often work simultaneously, making the response complex and context-dependent.`
    };
  }
}
