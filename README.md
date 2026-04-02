# Happy Lilacs

This is a project for SOEN357, User Interface Design, of Concordia University. 

## Introduction

Houseplants became more and more popular amongst the younger generation. The percentage of Gen Z and Millennials who take care of houseplants increased from 25% in 2028 to 34% by 2023; many began during the pandemic and continued [1]. A 2024 industry report found that 58% of plant owners consider themselves beginners because most of them are trying their best approach, but aren’t always confident or sure about how to really care for their plants [2]. A survey conducted in 2020 revealed that 3 in 10 respondents admit to worrying about killing their plants, 3 in 5 worry if their plants are given enough sunlight, and 56% worry if they are watering their plants correctly [3]. While plants are known to have positive effects on both mental and physical health, all the previous examples show how much frustration caring for a plant can bring if we don’t have the right support. 

To address the problem, we are proposing the design of a free and intuitive mobile plant care app. The app will include features such as plant information lookup, care scheduling calendar, and a reminder system to help users keep track of their plant care routines. The main challenge of the project is to ensure the app is easy to use while providing all the necessary features and information to the users. 

The target audience for the app is individuals with a busy schedule (students, professionals) who would like to incorporate plants into their environment without having to learn and remember complicated care routines. 

## Team Members


| Name | Student ID | Github Username | 
|------|-------------|----------------|
| Adriana Ruscitti-Titto    |  40239627  | Adriana643 |
| Océane Rakotomalala       |  40226514  | oceven |
| Jenna Sidi Abed           |  40270128  | xJennaS |
| Khujista Faqiri           |  40249541  | khujista-01 |
| Aidana Abdybaeva          |  40281501  | xidxnx |

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Add .env
   ```bash
   cd HappyLilacs
   ```

   Your file should contain the following with the correct values:
   ```
   BASE_URL=https://perenual.com/api
   PERENUAL_API_KEY=[INSERT PERENUAL API KEY HERE]
   EXPO_PUBLIC_SUPABASE_URL=[value here]
   EXPO_PUBLIC_SUPABASE_ANON_KEY=[value here]
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Development is done by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Expo Ressources

To learn more about developing with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## References

[1] Portland Press Herald, “Indoor gardening hasn’t grown old for millennial and Gen Z houseplant owners,” Apr. 2024. [Online]. Available: https://www.pressherald.com/2024/04/15/indoor-gardening-hasnt-grown-old-for-millennial-and-gen-z-houseplant-owners

[2] Gitnux, “Houseplant Industry Statistics and Trends in 2024.” [Online]. Available: https://gitnux.org/houseplant-industry-statistics/

[3] OnePoll and Article, “Seven in 10 Millennials Consider Themselves ‘Plant Parents,’” SWNS Research, 2020. [Online]. Available: https://swnsresearch.com
