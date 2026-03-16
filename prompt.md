You are a senior software architect and frontend engineer.

I want to build a personal English learning web application that is 100% frontend only.

Project name: DailyEnglish

Goals:
- personal English learning platform
- deployable as a static site
- optimized for performance
- scalable architecture
- easy to extend
- easy to edit lessons and resources

Tech constraints:
- React + Vite
- static JSON data
- no backend
- deploy to Vercel
- everything must run client-side

Content resources:
All resources must come from public internet sources:
- images from free image sources
- videos embedded from YouTube
- podcasts from public podcast sources
- pronunciation using browser speech API

Core features:
1. Topic-based vocabulary learning
   Examples:
   - Airport
   - Restaurant
   - Hotel
   - Office
   - Hospital
   - Travel
   - Daily conversation

2. Flashcards
   - flip card
   - word
   - IPA pronunciation
   - meaning
   - image
   - audio pronunciation

3. Listening practice
   - embedded YouTube lessons
   - short listening exercises

4. Speaking practice
   - use Web Speech API
   - allow user to practice pronunciation

5. Podcast learning
   - embed podcast player
   - show transcript if available

6. Vocabulary search
   - fast client-side search
   - search across words and meanings

7. Translation support
   - show translation (EN → user language)
   - keep data in JSON

8. Learning mode
   - flashcards
   - quiz
   - typing practice

Architecture requirements:
- modular folder structure
- topic-based data structure
- JSON-based content
- reusable components
- lazy loading for lessons
- optimized bundle size

Data structure example:
topics/
   airport.json
   restaurant.json
   travel.json

Each topic contains:
- video
- vocabulary list
- quiz questions

Design requirements:
- modern clean UI
- mobile friendly
- minimalistic
- fast loading

Performance requirements:
- must work well as a static site
- optimized for CDN delivery
- minimal dependencies
- easy to maintain

Deliver:
1. Full project architecture
2. Folder structure
3. Example JSON data
4. Key React components
5. Best practices for static deployment on Vercel