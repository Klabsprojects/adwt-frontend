import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  slides = [
    { url: 'assets/images/slide3.png', title: '', subtitle: '' },
    { url: 'assets/images/slide2.png', title: '', subtitle: '' },
    { url: 'assets/images/slide1.png', title: '', subtitle: '' },
    { url: 'assets/images/slide4.png', title: '', subtitle: '' },
    { url: 'assets/images/slide5.png', title: '', subtitle: '' },
    { url: 'assets/images/slide6.png', title: '', subtitle: '' }
  ];
  currentSlide = 0;

  imageUrls = [
    'assets/images/news1.png',
    'assets/images/slide1.png',
    'assets/images/slide2.png',
    'assets/images/slide3.png'
  ];

  initiatives = [
    {
      title: 'Empowering Local Research Talent',
      description: 'The CMRF provides funding to eligible postgraduates from Tamil Nadu to pursue full-time Ph.D. programs. This initiative encourages research careers among local scholars by supporting their academic journey financially.',

      icon: '🏗️'
    },
    {
      title: 'Focus on State-Specific Research Projects',
      description: 'CMRF scholars are encouraged to undertake research on issues relevant to Tamil Nadu, from public health to environmental sustainability, aligning academic efforts with state needs to produce practical outcomes that benefit the community.',

      icon: '🏥'
    },
    {
      title: 'Building Institutional Research Capacity',
      description: 'By funding research positions in state institutions, the CMRF fosters a stronger research culture in Tamil Nadu’s academic landscape, promoting knowledge sharing and innovation across disciplines like engineering, social sciences, and public policy.',
  
      icon: '🎓'
    },
    {
      title: 'Skill Development and Mentorship for Fellows',
      description: 'The fellowship offers structured mentorship, enabling fellows to work closely with experienced academics and researchers, which enhances their research skills and prepares them for impactful roles in academia and beyond.',

      icon: '💻'
    }
  ];
  trendData = [
    { title: "Big Data in Agriculture", description: "Recent Advances in Big Data, Machine and Deep Learning for Precision Agriculture", icon: "🌾",color:'green' },
    { title: "AI in Bioinformatics", description: "Artificial Intelligence and Bioinformatics Applications for Omics Studies", icon: "🧬",color:'blue' },
    { title: "Remote Sensing", description: "Remote Sensing for Field-based Crop Phenotyping", icon: "📡",color:'purple' },
    { title: "AI Healthcare", description: "AI Empowered Cerebro – Cardiovascular Health Engineering", icon: "🫀",color:'red' },
    { title: "Genomics Advances", description: "Current Advances in Genomics and Gene Editing Tools for Crop Improvement", icon: "🧪",color:'yellow' },
    { title: "Digital Health", description: "Digital Health and Big Data in Medicine: Current Trends and Challenges", icon: "💊",color:'pink' },
    { title: "AI Plant Science", description: "Advanced AI Methods for Plant Disease and Pest Recognition", icon: "🌿",color:'emerald' },
    { title: "Cybersecurity", description: "Threats, prevention strategies, and impact of cyber attacks", icon: "🔒",color:'cyan' },
    { title: "Blockchain", description: "Beyond cryptocurrencies – supply chain and voting systems", icon: "⛓️",color:'indigo' },
    { title: "Quantum Computing", description: "Breaking modern encryption and solving complex problems", icon: "💻",color:'violet' }
  ];


  ngOnInit() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  setCurrentSlide(index: number) {
    this.currentSlide = index;
  }
}
