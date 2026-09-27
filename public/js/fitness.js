/* Fitness Tips */

const tips = [
    "Stay consistent with your workouts. Even a short workout is better than no workout.",
    "Start your workout with a few minutes of light movement to prepare your body.",
    "Focus on proper exercise form before increasing the weight or intensity.",
    "Drink enough water throughout the day, especially when exercising.",
    "Include rest and recovery days in your fitness routine.",
    "Try to include a combination of strength training and cardiovascular activity.",
    "Set small and realistic fitness goals that you can maintain over time.",
    "Take short walking breaks if you spend long periods sitting.",
    "Eat a balanced diet with vegetables, fruits, whole grains and protein-rich foods.",
    "Getting enough sleep is an important part of exercise recovery."
];

const dailyTip = document.getElementById("dailyTip");
const newTipBtn = document.getElementById("newTipBtn");


/* New Tip */

newTipBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    dailyTip.textContent = tips[randomIndex];
});