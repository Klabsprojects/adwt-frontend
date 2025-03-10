import { Component } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent {
  documents = [
    {
      title: "G.O. (Ms). No.53 Higher Education (G1) Department Dated 27.02.2023",
     
      fileType: "PDF",
      downloadUrl: "assets/pdf/pdf3.pdf"
    },
    {
      title: "G.O. (Ms). No.56 Higher Education (G1) Department Dated 29.02.2024",
     
      
      fileType: "PDF",
      downloadUrl: "assets/pdf/pdf2.pdf"
    },
    {
      title: "G.O. (Ms). No.175 Higher Education (G1) Department Dated 30.09.2024",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/pdf1.pdf"
    },
    {
      title: "TRB Notification for CMRF Eligibility Test 2023 Dated 16.10.2023",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/pdf4.pdf"
    }
  ];
  downloadPdf(pdfPath: string) {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.setAttribute('download', pdfPath.split('/').pop() || 'download.pdf'); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
