# Test Prompts for MVT JSON Updater

## Example 1: Simple A/B Test (2 Variants)
**Prompt:**
```
Create an A/B test for checkout button text. Test "Buy Now" vs "Complete Purchase". 
Split traffic 50/50. Target desktop users in the US and Canada. 
Track conversion rate and average order value. Run for 14 days.
```

**Expected Output:**
- 2 variants (control and treatment)
- Geographic targeting (US, Canada)
- Device targeting (desktop)
- Multiple metrics (conversion rate, AOV)
- Time-based configuration

---

## Example 2: Multivariate Test (3+ Variants)
**Prompt:**
```
Set up a multivariate test for product page layout with 4 variants:
- Control: current design
- Variant A: larger product images with carousel
- Variant B: customer reviews above the fold
- Variant C: video demo at top

Distribute traffic equally across all variants. Target mobile users aged 25-45 in English-speaking countries. 
Track engagement time, add-to-cart rate, and bounce rate. Set minimum sample size of 1000 users per variant.
```

**Expected Output:**
- 4 variants with detailed configurations
- Equal traffic distribution (25% each)
- Age-based targeting
- Geographic targeting (English-speaking countries)
- Device targeting (mobile)
- Multiple metrics with statistical requirements

---

## Example 3: Complex Nested Test with Exclusions
**Prompt:**
```
Create an experiment for pricing page optimization testing 3 price points: $9.99, $14.99, and $19.99.
Split traffic 40% control ($9.99), 30% variant A ($14.99), 30% variant B ($19.99).

Target all users EXCEPT:
- Internal employees (IP range 192.168.1.0/24)
- Beta testers (segment ID: beta-users-2024)
- Users who already purchased (exclude converted users)

Only show to users on iOS or Android mobile devices with screen width less than 768px.
Track primary metric: purchase conversion rate (goal: 15% minimum).
Track secondary metrics: revenue per user, cart abandonment rate, and time to purchase.

Set confidence level to 95% and minimum detectable effect to 2%.
Run experiment in US, UK, Australia, and New Zealand only.
```

**Expected Output:**
- 3 variants with unequal distribution
- Complex exclusion rules (IP, segments, user behavior)
- Detailed device targeting with screen size
- Geographic targeting (4 countries)
- Primary and secondary metrics with statistical parameters
- Nested configuration with 4-6 levels deep

---

## Testing Tips

1. **Start Simple**: Test Example 1 first to verify basic functionality
2. **Add Complexity**: Move to Example 2 to test multiple variants
3. **Full Features**: Use Example 3 to test all nested configurations
4. **With Template**: Upload `example_mvt_config.json` and ask to modify it:
   - "Change the button color from red/blue to green/yellow"
   - "Add a third variant with purple button"
   - "Change targeting to desktop users only"
5. **Edge Cases**: Try intentionally vague prompts to see how Claude handles ambiguity

## Expected Behavior

- JSON should be valid and properly formatted
- Nesting should be 4-6 levels deep
- All specified parameters should be included
- Reasonable defaults should be added for unspecified details
- Structure should be consistent across generations
