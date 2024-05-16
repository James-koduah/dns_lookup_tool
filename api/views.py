from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import dns.resolver

# Create your views here.

def frontend(request):
    return render(request, 'index.html')



@csrf_exempt
def get_records(request):
    if request.method == 'POST':
        # return JsonResponse({'domain': 'jaskintech.com', 'data': {'a': ['185.199.111.153', '185.199.109.153', '185.199.110.153', '185.199.108.153'], 'aaaa': [], 'cname': [], 'txt': ['"v=spf1 +a +mx +ip4:185.150.190.222 ~all"'], 'mx': ['0 jaskintech.com.'], 'dnskey': [], 'soa': ['ns1.stormerhost.com. hostingfeedback.stormerhost.com. 2024051604 3600 1800 1209600 86400'], 'ptr': [], 'ds': [], 'ns': ['ns2.stormerhost.com.', 'ns1.stormerhost.com.'], 'caa': [], 'srv': []}})
        try:
            data = json.loads(request.body)
            domain = data.get('domain')
            records = data.get('records')
            if len(records) == 1 and records[0] == 'all':
                records = ["a", "aaaa", "cname", "txt", "mx", "dnskey", "soa", "ptr", "ds", "ns", "caa", "srv"]
            response = {}
            for record in records:
                response[record] = []
                try:
                    answers = dns.resolver.resolve(domain, record)
                    for rdata in answers:
                        # Decode bytes to string
                        response[record].append(rdata.to_text())
                except Exception as e:
                    pass
            sorted_keys = sorted(response.keys(), key=lambda k: (len(response[k]) == 0))
            sorted_response = {key: response[key] for key in sorted_keys}
            return_data = {
                'domain': domain,
                'data': sorted_response
            }
            return JsonResponse(return_data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    return JsonResponse({'error': 'Method Not Allowed'}, status=400)