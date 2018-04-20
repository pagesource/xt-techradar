# PWA

## Quadrant
grow

## Type
concepts

## Description
Progressive web apps is one of the most talked about technology shifts in the web and has gained unparalleled momentum among the practitioners in the IT world. If you are building for the web, I’m sure that PWA is the latest ‘buzzword’ that has been added to your work vocabulary. Its not surprising because PWA has made the far fetched dream of installing web apps on phone for real.

There has already been a lot of spotlight and geekspeaks on building PWA and its advantages. Most of the attempt to introduce PWA, especially to the newbies, seem to be jargon filled or had too much of code that could intimidate them to take the first step. In this article I’m trying to give a snapshot of PWA, just enough to kickstart their learning process.

**1. What is a Progressive Web App?**
Progressive Web App (PWA) is a term used to denote a new software development methodology. Unlike traditional applications, progressive web apps are a hybrid of regular web pages (or websites) and a mobile application. This new application model attempts to combine features offered by most modern browsers with the benefits of mobile experience.

This is what wikipedia says about PWA. Well this might seem a bit vague or even contentious. So lets look at PWA in an informal way.

If ever the best of web and the best of apps had a clone child — it is PWA. Or else, its just that the web page has taken all the ‘right vitamins’ so that it can behave more like an app downloaded from the App Store/ Play Store. It starts as a normal web page in a browser and as a user explores the webpage they get the prompt if the like to “Add to Home Screen”. Once the user gives the thumbs up to this prompt, VOILA! PWA gets added to their home screen. Once open from the home screen, it can even hide the browser UI controls and appear as an app.

This is more like a glorified book mark that has hit the sweet spot between the web and mobile apps. I say this because PWA has managed to crack the gap in the web. The web has always been thirsty for reliable performance at par with the native apps. It has always yearned for a place in the notification tray and in the home screen just like an app. More than 40% of the users bounce from the websites that takes more than 3 seconds to load. PWA is a solution for this “Web Obesity Epidemic” faced by the users.

It is all about removing friction and making it easy for the users to get to what they want.

The entire credit for this seamless experience should be given to the Service Worker( A script that the browser runs in the background separate from web page), which is the back bone of every PWA. The service workers enable reliable and intelligent caching, background content updating, push notifications and the most attractive offline functionality to prior visited sites. This means that, after the first visit to a website, the site and app will be reliably fast even on flaky networks.

But a question could arise here, what about the fast first load with reliable performance? Thats when Accelerated Mobile Pages (AMP) meets service worker. AMP provides reliably fast web component for first load. These components are much faster to load and less data hungry. Websites that use the combo of AMP and Service Worker will provide reliable speed as of native apps. Once the page is loaded the site setups the service worker and assets are cached intelligently. This will always keep the PWA up to date thereby freeing the users from the frequent updates to be done from the App Store.

**PWA in a nutshell:**

* **Reliable** : Fast loading and works offline
* **Fast** : Smooth Animations, jank free scrolling and seamless navigation even on flaky networks
* **Engaging** : Launched from home screen and can receive push notification

**2. Why is it important ?**
* It is a myth that the users will happily download the app of every website they visit frequently. According to Comscore Mobile App Report, over 50% of America’s smart phone users download Zero Apps a month. i.e. Gone are the days when the phone is full of apps and people-smart phone honeymoon phase is getting depleted. Each step to download an app reduce 20% of users. PWA reduces the steps between discovery of an app and getting it on the home screen and there by eliminate friction of getting an app installed. This provides a very fertile ground for businesses to pitch in their PWA.

The following three matrices can be highlighted to understand the importance of PWA in moulding the future web.

**1. Reach :** The mobile web audience has grown in a sky rocketing pace over the last few years. Google has reported that Chrome has whooping 1 billion mobile users compared to the east while 400 million users in 2016. As per the Comscore’s report the reach of mobile web is 2.5 times more than that of apps, while considering the top 1000 sites and apps. This is the reason why the decision of Flipkart, Myntra etc. to abandon their website and be ‘app only’ backfired. If we could provide a better experience to a wider audience, we could surely get a competitive edge over the others.

**2. Acquisition :** Another serious concern faced by the mobile apps is its user discoverability compared to websites. The user acquisition cost of web will be 10 times cheaper than that of native apps. With more exposure and low friction for on-boarding, PWA is likely to acquire more users at very less expense.

**3. Conversion :** The seamless end to end user experience even with flaky networks provided by PWA improves the number of successful conversions. Flipkart launched their PWA ‘Flipkart-lite’, which they claim to have delivered an increase in the conversion rate by 70% with lower acquisition cost.


**To sum up :** PWA helps to improve conversions by increasing potential reach with low acquisition costs.

**3. How to get started ?**
Once you get to know a new technology, the next challenge in-line is the decision to adopt it. Most of the people gets into a dilemma at this point. Decision should be driven by your specific business need. Following two cases could help you identify the method that fits you to implement PWA.

* **a) From ground zero**

Consider the scenario when a company is building a new website or going through a redesign. In this case, building a PWA from ground zero makes sense and is feasible. This will have the business to harness the power of PWA with AMP, service workers, App shell and Web Manifest. For e.g.. According to Ali Express once they revamped their website as PWA, they were able to increase their conversion rate for new users by 104%, gained 2X more pages visited per session per user across all browsers and 74% increase in time spent per session across all browsers.

* **b) A simple version or A Single feature**

When building from scratch is not realistic, one can always build a simple version of the website or focus on a single feature that has a high impact for end users. The focus is to deliver a fast and engaging reliable experience. AirBerlin is an appropriate example in this case. They focussed on the post- booking experience in their PWA. After a passenger has checked in, they can access their journey details and boarding pass even without internet connectivity.

**4. Challenges in PWA**

There are some challenges in PWA which has to be considered while choosing it.

* **a) Cross Browser Support :** While Chrome, Opera, and Samsung’s android browser supports PWA, IE, Edge and Safari are yet to extent its support.

* **b) Limited Functionality :** PWA doesn’t have support to any hardware that is not supported by HTML5

* **c) Limited Legitimacy:** As there is no central download Store for PWA, they lack in giving a sense of legitimacy and confidence which is usually given by native apps from Play Store/App Store.

* **d) Cross Application Login Support :** Native apps have capability to talk to other apps and authenticate logins (Facebook, Twitter, Google). As a webpage, PWA doesn’t have capability to communicate with other apps installed.

**Conclusion**
We can’t say that PWA will kill Native Apps in the future. But still there is a growing interest for this approach in the community. PWAs are still in their infancy with a lot of challenges to be addressed. Yet they have the potential to create a shift in the way the web works.

**Food for Thought**

According to Henrik Joreteg, **“PWA is the single biggest thing to happen on the mobile web since Steve introduced the iPhone!”**

## Resources
[PWA](https://developers.google.com/web/progressive-web-apps/)
[PWA Udemy](https://www.udemy.com/progressive-web-app-pwa-the-complete-guide/)
[PWA Rocks](https://pwa.rocks/)

## Github
[PWA Nuxt community](https://github.com/nuxt-community/pwa-module)

### Platform
web,mobile