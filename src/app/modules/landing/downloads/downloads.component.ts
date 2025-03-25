import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent {
  constructor(public lang:LandingService){
    
  }
  documents = [
    {
      title: "1. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989",
     
      fileType: "PDF",
      downloadUrl: "assets/pdf/1. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989.pdf"
    },
    {
      title: "2. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Act, 2015",
     
      
      fileType: "PDF",
      downloadUrl: "assets/pdf/2. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Act, 2015.pdf"
    },
    {
      title: "3. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Act, 2018",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/3. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Act, 2018.pdf"
    },
    {
      title: "4. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Rules, 1995",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/4. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Rules, 1995.pdf"
    },
    {
      title: "5. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Rules, 2016",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/5. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Rules, 2016.pdf"
    },
    {
      title: "6. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Rules, 2018",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/6. Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Rules, 2018.pdf"
    },
    {
      title: "7. Model Contingency Plan Tamil Nadu, 2017",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/7. Model Contingency Plan Tamil Nadu, 2017.pdf"
    },
    {
      title: "8. G.O. for enhancement of relief given to SC ST victims of Atrocities 2022",
     

      fileType: "PDF",
      downloadUrl: "assets/pdf/8. G.O. for enhancement of relief given to SC ST victims of Atrocities 2022.pdf"
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
