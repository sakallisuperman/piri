# PIRI PROJECT – TECH & PRODUCT HANDOFF + MASTER BLUEPRINT

## 1. Product Vision
- AI-based decision simulation system
- Does NOT give advice, NOT therapy
- Models how a person makes decisions and simulates possible outcomes
- Analyzes psychological patterns behind hesitation and decision blocks
- Goal: help people understand their own decision patterns

## 2. Core User Journey
1. User enters Piri interface → meets Piri orb (AI presence)
2. Chooses decision domain: Work / Life / Love
3. Answers layered question sequence (27 questions per door)
4. Piri builds a Decision Signature
5. Piri runs simulation of potential outcomes

## 3. Decision Domains (Doors)
- **Work** – career, ambition, direction, status, risk
- **Life** – lifestyle, location, identity shifts, stability
- **Love** – relationships, attachment, emotional risk

## 4. Question Architecture
- Each domain: 3 layers × 9 questions = 27
- **Layer 1** – fast behavioral signals (6-point Likert choice)
- **Layer 2** – deeper psychological dynamics (6-point Likert choice)
- **Layer 3** – narrative text input (open-ended)

## 5. Question Metadata
- mode: work | life | love
- layer: 1 | 2 | 3
- primary dimension: main signal measured
- secondary signals: hidden psychological indicators
- inputType: choice | text
- reverse: boolean (inverted scoring)

## 6. Core Decision Dimensions
- **risk** – willingness to move into unknown territory
- **uncertainty** – tolerance for ambiguity
- **regret** – sensitivity to future regret
- **agency** – sense of personal control
- **energy** – ability to sustain effort
- **attachment** – tendency to stay with known patterns

## 7. Shadow Signals (Hidden Drivers)
- **perfectionism** – need for perfect conditions before acting
- **approval seeking** – external validation dependency
- **abandonment sensitivity** – fear of being left
- **control need** – discomfort when not in control
- **avoidance** – delay as temporary relief
- **inner critic** – harsh internal voice

## 8. Decision Signature
- Answers → normalized scores (0–100)
- Top shadow signals extracted
- Genome code generated (R-U-G-A-E-T bands: 0/1/2)
- This = user's Decision Signature

## 9. Current Prototype State
- ✅ Functional layered questionnaire
- ✅ Door-based architecture
- ✅ Decision Signature scoring system
- ✅ Basic UI with Piri orb concept
- ✅ Result visualization with dimension bars
- ⚠️ Simulation = hardcoded scenarios
- ⚠️ No backend, localStorage only
- ⚠️ No AI interpretation of text answers

## 10. Planned Features (Future)

### Simulation Engine
- Model multiple future paths based on decisions
- Each path = probability tree
- Simulate emotional, practical, and psychological outcomes

### AI Interpretation Layer
- LLMs analyze narrative (Layer 3) answers
- Decision archetypes identified
- Dynamic insights generated per user

### Cross-Domain Profile
- If user completes multiple doors → merge data
- Global personality profile emerges
- Reveals contradictions between life domains

### Social Layer
- Match users with similar decision patterns
- Anonymous discussion clusters
- Shared decision journeys

## 11. UI Philosophy
- Calm AI presence (Piri orb)
- No therapy tone
- No motivational language
- Direct but safe communication
- User autonomy remains central

## 12. Product Philosophy
- Piri is not therapy
- Piri does not instruct users
- Piri reveals patterns and consequences
- User autonomy is central
