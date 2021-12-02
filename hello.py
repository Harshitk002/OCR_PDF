import tabula
import os 
import pdfplumber
import sys
with pdfplumber.open(r'uploads/uploaded_file.pdf') as pdf:
    first_page = pdf.pages[0]
    arr=first_page.extract_text()
    i=0
    while(True):
        temp=''
        for j in range(i,i+7):
            temp=temp+arr[j]
        if(temp=='BILL TO'):
            break
        i=i+1
    i=i+8
    add=""
    c=0
    while(c<4):
        if(arr[i]=='\n'):
            c=c+1
        add=add+arr[i]
        i=i+1

    
    print('Address:-\n'+add)
    print("\n")
i=0
while(True):
    if(arr[i]=='@'):
        break
    i+=1
l=i-1
email="@"
l=i+1
while(arr[l]!=' '):
    email=email+arr[l]
    l+=1;
r=l+1
inv=""
while(arr[r]!=' '):
    inv=inv+arr[r]
    r+=1
print('Invoice number:-\n'+inv)
print("\n")
j=0
while(arr[j]!='-'):
    j=j+1
phone="-"
x=j-1
while(arr[x]!='\n'):
    phone=arr[x]+phone
    x=x-1
x=j+1
while(arr[x]!='\n'):
    phone=phone+arr[x]
    x=x+1
print('phone number:-\n'+phone)
print("\n")
y=x+1
email=""
while(arr[y]!='\n'):
    email=email+arr[y]
    y+=1
print('email:-\n'+email)
print("\n")
tables=tabula.read_pdf("uploads/uploaded_file.pdf", pages="all")
print(tables[1])	
print("\n")


